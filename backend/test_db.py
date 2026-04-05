from database import init_db, get_db

try:
    init_db()
    db = get_db()
    print("✅ MongoDB Atlas connection successful!")
    print(f"   Database: {db.name}")
except Exception as e:
    print(f"❌ Connection failed: {e}")