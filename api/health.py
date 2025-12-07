from flask import Flask, jsonify
from datetime import datetime
import os

from pymongo import MongoClient

app = Flask(__name__)

MONGO_URI = os.getenv("MONGODB_URI")

@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint"""
    mongo_status = "not_configured"
    
    if MONGO_URI:
        try:
            client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
            client.admin.command("ping")
            mongo_status = "connected"
            client.close()
        except:
            mongo_status = "error"
    
    return jsonify({
        "status": "ok",
        "service": "cint.ia API",
        "mongodb": mongo_status,
        "timestamp": datetime.utcnow().isoformat()
    })

# app = app
