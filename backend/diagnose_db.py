import os
from dotenv import load_dotenv
load_dotenv()
from database import get_db
from datetime import datetime

try:
    db = get_db()
    print(f"✅ Connected to: {db.name}")
    
    test_doc = {
        "user_id": "test_agent_user",
        "user_message": "Hello from the AI agent!",
        "ai_response": "I am helping you fix the database issue.",
        "emotion": "Positive",
        "severity": 1,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    res = db.conversations.insert_one(test_doc)
    print(f"✅ Inserted test document with ID: {res.inserted_id}")
    
    # Also check if other collections exist
    collections = db.list_collection_names()
    print(f"📊 Collections: {collections}")

except Exception as e:
    print(f"❌ Error: {e}")
