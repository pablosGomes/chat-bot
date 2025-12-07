from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import requests
import os

# MongoDB
from pymongo import MongoClient

# ========================================
# CONFIGURAÇÃO
# ========================================

app = Flask(__name__)
CORS(app)

# Mistral API
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
# Ajustes otimizados para máxima qualidade
MISTRAL_MAX_TOKENS = int(os.getenv("MISTRAL_MAX_TOKENS", "350"))
MISTRAL_TEMPERATURE = float(os.getenv("MISTRAL_TEMPERATURE", "0.75"))
MISTRAL_TOP_P = float(os.getenv("MISTRAL_TOP_P", "0.9"))
MISTRAL_HISTORY_LIMIT = int(os.getenv("MISTRAL_HISTORY_LIMIT", "6"))

# MongoDB
MONGO_URI = os.getenv("MONGODB_URI")
mongo_client = None
db = None

def get_db():
    """Conexão lazy com MongoDB"""
    global mongo_client, db
    if mongo_client is None and MONGO_URI:
        try:
            mongo_client = MongoClient(MONGO_URI)
            db = mongo_client.cintia_db
        except Exception as e:
            print(f"Erro MongoDB: {e}")
    return db

# ========================================
# SYSTEM PROMPT
# ========================================

SYSTEM_MESSAGE = {
    "role": "system",
    "content": """Você é a cint.ia, a melhor amiga de quem quer mandar bem na redação. Você trabalha pro CRIA, o corretor de redações com IA.

PERSONALIDADE: Jovem, esperta, acolhedora. Fala como gente de verdade - nada de robô. Você ADORA ajudar e fica genuinamente feliz quando o aluno entende algo.

REGRAS DE OURO:
1. Responda SÓ o que perguntaram - nada de textão
2. Máximo 3 frases (pode ser menos!)
3. Zero formatação markdown (nada de **negrito** ou - listas)
4. Um emoji no máximo, e só se combinar
5. Termine com pergunta ou incentivo quando fizer sentido

COMO VOCÊ FALA (copie esse estilo):

"Como funciona o CRIA?"
→ "Super simples! Você manda sua redação, escolhe se quer só a nota ou a análise completa, e a IA te dá o feedback na hora. Quer que eu explique como enviar?"

"O que são CRIACOINS?"
→ "São suas moedinhas pra usar correção detalhada! Dá pra ganhar no quiz, indicando amigos ou na roleta. 🎯"

"Dicas de redação"
→ "Bora! O segredo é: tese clara logo na intro, dois argumentos fortes no desenvolvimento, e proposta de intervenção completa no fim. Qual parte tá te travando?"

"Competências ENEM"
→ "São 5, cada uma vale 200 pontos: escrita correta, entender o tema, argumentar bem, conectar as ideias e propor solução. Quer focar em alguma?"

"Tô nervoso pro ENEM"
→ "Relaxa, isso é normal! O importante é praticar bastante - cada redação te deixa mais preparado. Bora treinar juntos? 💪"

"Quanto custa?"
→ "Os valores certinhos você encontra na página de planos! Mas tem opção grátis pra começar."

"Não entendi minha nota"
→ "Sem problemas! Me conta qual competência ficou confusa que eu te explico direitinho."

O QUE VOCÊ SABE:
- CRIA corrige redações com IA (90% de precisão vs professores)
- Gêneros: ENEM, resenha, editorial, carta aberta, artigo de opinião, crônica
- Aceita foto de redação manuscrita (OCR)
- Correção rápida = só nota | Detalhada = nota + análise + PDF
- CRIACOINS: quiz dá 100 moedas/acerto, indicação e roleta também dão
- Aluno sozinho: plano grátis existe, pode comprar moedas | Com escola: ganha moedas dela
- Sugerir tema: botão da lâmpada | Problema: ícone laranja ou Contato

LIMITES:
- Só fala de CRIA, redação, ENEM e vestibulares
- Não sabe preços exatos - manda pra página de planos
- Se não souber: "Hmm, isso eu não sei, mas o suporte resolve rapidinho!"
- Fora do escopo: "Opa, nisso eu não posso ajudar, mas qualquer dúvida de redação tô aqui!"
"""
}

# ========================================
# FUNÇÕES AUXILIARES
# ========================================

def save_conversation(session_id: str, user_message: str, bot_response: str):
    """Salva conversa no MongoDB"""
    database = get_db()
    if database is None:
        return
    
    try:
        message_entry = {
            "user": user_message,
            "bot": bot_response,
            "timestamp": datetime.utcnow()
        }
        
        database.conversations.update_one(
            {"session_id": session_id},
            {
                "$push": {"messages": message_entry},
                "$set": {"updated_at": datetime.utcnow()},
                "$setOnInsert": {"created_at": datetime.utcnow()}
            },
            upsert=True
        )
    except Exception as e:
        print(f"Erro ao salvar: {e}")


# ========================================
# HANDLER PRINCIPAL
# ========================================

@app.route("/api/chat", methods=["POST", "OPTIONS"])
def chat():
    """Handler para Vercel Serverless"""
    
    if request.method == "OPTIONS":
        return "", 204
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Dados inválidos"}), 400
        
        messages = data.get("messages", [])
        user_message = data.get("userMessage", "").strip()
        session_id = data.get("sessionId", "anonymous")
        
        # Validações
        if not user_message:
            return jsonify({"error": "Mensagem não pode estar vazia"}), 400
        
        if len(user_message) > 2000:
            return jsonify({"error": "Mensagem muito longa (máx 2000 caracteres)"}), 400
        
        if not MISTRAL_API_KEY:
            return jsonify({"error": "Serviço temporariamente indisponível"}), 503

        # Monta histórico
        formatted_messages = [SYSTEM_MESSAGE]
        
        for msg in messages[-MISTRAL_HISTORY_LIMIT:]:
            role = msg.get("role")
            text = msg.get("text", "")
            
            if role == "user":
                formatted_messages.append({"role": "user", "content": text})
            elif role == "bot":
                formatted_messages.append({"role": "assistant", "content": text})
        
        formatted_messages.append({"role": "user", "content": user_message})

        # Chama Mistral
        response = requests.post(
            MISTRAL_API_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {MISTRAL_API_KEY}"
            },
            json={
                "model": "mistral-small-latest",
                "messages": formatted_messages,
                "max_tokens": MISTRAL_MAX_TOKENS,
                "temperature": MISTRAL_TEMPERATURE,
                "top_p": MISTRAL_TOP_P,
                "safe_prompt": False
            },
            timeout=20
        )

        if not response.ok:
            print(f"Erro Mistral: {response.status_code}")
            return jsonify({"error": "Erro ao processar mensagem"}), 500

        result = response.json()
        bot_response = result["choices"][0]["message"]["content"]

        # Salva no MongoDB
        save_conversation(session_id, user_message, bot_response)

        return jsonify({"response": bot_response})

    except requests.Timeout:
        return jsonify({"error": "Tempo esgotado. Tente novamente."}), 504
    except Exception as error:
        print(f"Erro: {error}")
        return jsonify({"error": "Erro interno"}), 500


# Para Vercel
app.debug = True
# handler = app
