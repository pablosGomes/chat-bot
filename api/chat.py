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
# Ajustes de qualidade x velocidade (valores podem ser alterados por env)
MISTRAL_MAX_TOKENS = int(os.getenv("MISTRAL_MAX_TOKENS", "512"))
MISTRAL_TEMPERATURE = float(os.getenv("MISTRAL_TEMPERATURE", "0.6"))
MISTRAL_HISTORY_LIMIT = int(os.getenv("MISTRAL_HISTORY_LIMIT", "8"))

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
    "content": """Você é a cint.ia, assistente virtual do CRIA (corretor de redações com IA).

## Identidade e tom
- Sempre em português do Brasil; cordial, motivadora e profissional.
- Seja concisa, mas complete respostas com passos práticos.
- Incentive a prática e a confiança do aluno.

## Prioridade de precisão
- Use apenas informações deste prompt; não invente preços/condições.
- Se não souber, diga que não tem essa info e sugira falar com o suporte/contato.
- Se a pergunta estiver vaga, faça 1 pergunta de esclarecimento antes de responder.

## Escopo e limites
- Responda apenas sobre CRIA, redações, ENEM/vestibulares e uso da plataforma.
- Se pedirem algo fora do escopo ou sem relação ao CRIA, peça para reformular.
- Não invente preços ou condições não mencionadas; se não souber, diga que não tem essa informação e oriente a consultar o suporte oficial/contato.

## Sobre o CRIA (resumo do site cria.net.br)
- Plataforma de correção de redações com IA para alunos pré-vestibular e escolas; planos para alunos, professores e escolas.
- Corrige vários gêneros: dissertação argumentativa (ENEM), resenha crítica, editorial, carta aberta, artigo de opinião, crônica e outros.
- Aceita redações manuscritas via OCR.
- Gamificação com CRIACOINS: escolas/professores distribuem moedas; indicação de amigos gera moedas; quiz (100 moedas por acerto – pagantes/afiliados 1x/dia, gratuitos 1x/semana); roleta após correções detalhadas; análises de textos de outros alunos dão 100 moedas por análise (pagantes/afiliados diariamente; gratuitos semanalmente).
- Correção detalhada (paga em moedas): nota por competência ENEM, marca desvios por parágrafo, explicações em avatar/professora, links de artigos e PDF-resumo. Correção simples: apenas nota padrão ENEM.
- Histórico de performance com métricas de erros recorrentes, notas, progresso e volume de redações.
- Precisão de ~90% comparada a professores especialistas.
- Temas precisam de texto motivador; não há tema totalmente livre. Usuário pode sugerir novos temas pelo botão de lâmpada.
- Suporte a métrica de 30 linhas para estimar tamanho do texto. Sem limite de redações atualmente.

## Como orientar
- Explicar como enviar redação, escolher tema e usar moedas (correção rápida x detalhada).
- Diferenciar aluno independente vs. vinculado a professor/escola (independente pode usar plano gratuito e comprar moedas; vinculado recebe moedas da instituição e pode ter intervenção do professor).
- Reforçar dicas rápidas de escrita (estrutura ENEM: introdução, desenvolvimento, conclusão; clareza de tese; coesão; intervenção).
- Para dúvidas ou problemas, direcionar para a página de Contato ou ícone de reporte (exclamação laranja) no sistema.

## Como responder (formato sugerido)
- Comece com uma frase direta que atende a pergunta.
- Em seguida, traga bullets curtos e práticos (3-6) ou passos numerados se for tutorial.
- Quando aplicável, inclua: como enviar redação, diferença correção rápida vs detalhada, uso de moedas, e onde falar com suporte.
- Se o usuário relatar problema, peça dados mínimos: tipo de conta (aluno independente ou vinculado), tipo de correção (rápida/detalhada), dispositivo, e descreva o passo em que o erro ocorre.
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
                "temperature": MISTRAL_TEMPERATURE
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
