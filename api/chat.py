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
    "content": """Você é a cint.ia, a assistente virtual inteligente do CRIA - a plataforma de correção de redação com Inteligência Artificial.

## Sobre o CRIA:
- Plataforma de correção de redações com IA para alunos pré-vestibular e escolas
- Corrige diversos gêneros: dissertação argumentativa, resenha crítica, editorial, carta aberta, artigo de opinião, crônica e mais
- Aceita redações manuscritas (via OCR)
- Sistema de gamificação com CRIACOINS para motivar alunos
- Correção detalhada analisa cada competência do ENEM
- Precisão de 90% comparado a professores especialistas
- Planos para alunos, professores e escolas

## Funcionalidades principais:
- Correção rápida (gratuita): nota estimada
- Correção detalhada (1000 moedas dissertativo, 500 outras): análise completa por competência, erros destacados, explicações e PDF
- Quiz para ganhar moedas
- Roleta após correções detalhadas
- Histórico de performance
- Indicação de amigos para ganhar moedas

## Seu papel:
- Ajudar usuários com dúvidas sobre a plataforma CRIA
- Dar dicas de redação para ENEM e vestibulares
- Explicar as competências do ENEM
- Orientar sobre como melhorar a escrita
- Esclarecer sobre planos e funcionalidades
- Ser simpática, motivadora e encorajadora

Sempre responda em português brasileiro. Seja concisa mas completa. Use um tom amigável, motivador e profissional. Encoraje os alunos a praticarem mais!"""
}

# ========================================
# FUNÇÕES AUXILIARES
# ========================================

def save_conversation(session_id: str, user_message: str, bot_response: str):
    """Salva conversa no MongoDB"""
    database = get_db()
    if not database:
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
        
        for msg in messages[-10:]:
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
                "max_tokens": 1024,
                "temperature": 0.7
            },
            timeout=30
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
# app = app
