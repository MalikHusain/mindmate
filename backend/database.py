import os
import certifi
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from dotenv import load_dotenv
load_dotenv()

# ---------- MongoDB Atlas Connection ----------
# Get connection strings inside get_db to ensure env vars are loaded
_client = None
_db = None


def get_db():
    global _client, _db
    if _db is None:
        MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        DB_NAME = os.getenv("MONGO_DB_NAME", "mindmate")
        try:
            from pymongo import MongoClient

            if "mongodb+srv" in MONGO_URI or "mongodb.net" in MONGO_URI:
                _client = MongoClient(
                    MONGO_URI,
                    tls=True,
                    tlsCAFile=certifi.where(),    # ← THE FIX
                    serverSelectionTimeoutMS=20000,
                    connectTimeoutMS=20000,
                    socketTimeoutMS=20000,
                    retryWrites=True,
                )
            else:
                _client = MongoClient(MONGO_URI)

            db_name = os.getenv("MONGO_DB_NAME", "mindmate")
            print(f"📡 [DATABASE] Initializing connection to: {MONGO_URI[:25]}...")
            print(f"✅ [DATABASE] Connected to MongoDB Atlas: {db_name}")
            _db = _client[db_name]

        except Exception as e:
            print(f"❌ MongoDB Connection Error: {e}")
            print("   Please check your MONGO_URI in .env file")
            raise
    return _db


def init_db():
    """Create indexes for performance."""
    try:
        db = get_db()
        
        # Create indexes for faster queries
        db.conversations.create_index("timestamp")
        db.conversations.create_index([("user_id", 1), ("timestamp", -1)])
        db.journal.create_index("timestamp")
        db.journal.create_index([("user_id", 1), ("timestamp", -1)])
        db.gratitude.create_index("timestamp")
        db.gratitude.create_index([("user_id", 1), ("timestamp", -1)])
        db.achievements.create_index("badge_id")
        db.user_stats.create_index("user_id")
        
        print("✅ MongoDB indexes created successfully")
    except Exception as e:
        print(f"⚠️ Index creation warning: {e}")


def _id_str(doc):
    """Convert MongoDB _id to string id for JSON serialization."""
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

def save_user_login(user_info):
    """Save user login event including provider and timestamp."""
    db = get_db()
    user_id = user_info.get("email", "unknown")
    doc = {
        "user_id": user_id,
        "name": user_info.get("name"),
        "email": user_id,
        "picture": user_info.get("picture"),
        "provider": user_info.get("provider", "email"),
        "last_login": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    }
    # Update user or insert if doesn't exist
    db.users.update_one(
        {"email": user_id},
        {"$set": doc},
        upsert=True
    )
    
    # Also log the login event
    db.login_logs.insert_one({
        "user_id": user_id,
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "provider": user_info.get("provider")
    })
    return user_id


# ============================================================
#  CONVERSATIONS
# ============================================================

def save_conversation(user_message, ai_response, emotion, severity, recommendation=None, user_id="default_user"):
    db = get_db()
    doc = {
        "user_id": user_id,
        "user_message": user_message,
        "ai_response": ai_response,
        "emotion": emotion,
        "severity": int(severity),
        "recommendation": recommendation or "",
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    result = db.conversations.insert_one(doc)
    doc_count = db.conversations.count_documents({})
    print(f"💾 [DATABASE] Conversation saved! ID: {result.inserted_id} | User: {user_id}")
    print(f"📊 [DATABASE] Total documents in 'conversations': {doc_count}")
    _check_achievements(db, user_id)
    return str(result.inserted_id)


def get_recent_moods(days=7, user_id="default_user"):
    db = get_db()
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat().replace("+00:00", "Z")
    cursor = db.conversations.find(
        {"user_id": user_id, "timestamp": {"$gte": since}},
        {"user_message": 1, "emotion": 1, "severity": 1, "timestamp": 1}
    ).sort("timestamp", 1)
    return [_id_str(doc) for doc in cursor]


def get_last_n_moods(n=5, user_id="default_user"):
    db = get_db()
    cursor = db.conversations.find(
        {"user_id": user_id},
        {"user_message": 1, "emotion": 1, "severity": 1, "timestamp": 1, "recommendation": 1}
    ).sort("timestamp", -1).limit(n)
    return [_id_str(doc) for doc in cursor]


def get_all_conversations(user_id="default_user"):
    db = get_db()
    cursor = db.conversations.find({"user_id": user_id}).sort("timestamp", 1)
    return [_id_str(doc) for doc in cursor]


# ============================================================
#  JOURNAL
# ============================================================

def save_journal_entry(title, content, mood="Neutral", user_id="default_user"):
    db = get_db()
    doc = {
        "user_id": user_id,
        "title": title,
        "content": content,
        "mood": mood,
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    result = db.journal.insert_one(doc)
    _check_achievements(db, user_id)
    return str(result.inserted_id)


def get_journal_entries(user_id="default_user", limit=50):
    db = get_db()
    cursor = db.journal.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
    return [_id_str(doc) for doc in cursor]


# ============================================================
#  GRATITUDE
# ============================================================

def save_gratitude_entry(items, user_id="default_user"):
    """Save a gratitude entry (list of 1-3 things user is grateful for)."""
    db = get_db()
    doc = {
        "user_id": user_id,
        "items": items,  # list of strings
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    }
    result = db.gratitude.insert_one(doc)
    _check_achievements(db, user_id)
    return str(result.inserted_id)


def get_gratitude_entries(user_id="default_user", limit=30):
    db = get_db()
    cursor = db.gratitude.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
    return [_id_str(doc) for doc in cursor]


# ============================================================
#  MOOD CALENDAR & STREAKS
# ============================================================

def get_mood_calendar(user_id="default_user", days=30):
    db = get_db()
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat().replace("+00:00", "Z")
    convos = list(db.conversations.find(
        {"user_id": user_id, "timestamp": {"$gte": since}},
        {"timestamp": 1, "emotion": 1}
    ))

    # Group by date
    day_map = {}
    for c in convos:
        date_str = c["timestamp"][:10]
        if date_str not in day_map:
            day_map[date_str] = {"emotions": [], "count": 0}
        score = {"Positive": 3, "Neutral": 2, "Negative": 1}.get(c["emotion"], 2)
        day_map[date_str]["emotions"].append(score)
        day_map[date_str]["count"] += 1

    result = []
    for date_str, data in sorted(day_map.items()):
        avg = sum(data["emotions"]) / len(data["emotions"])
        result.append({
            "date": date_str,
            "avg_score": round(avg, 2),
            "count": data["count"],
        })
    return result


def get_mood_streaks(user_id="default_user"):
    db = get_db()
    convos = list(db.conversations.find(
        {"user_id": user_id}, 
        {"timestamp": 1}
    ).sort("timestamp", -1))

    if not convos:
        return {"current_streak": 0, "total_days": 0, "total_entries": 0}

    dates = sorted(set(c["timestamp"][:10] for c in convos), reverse=True)

    current_streak = 0
    for i, d in enumerate(dates):
        expected = (datetime.now(timezone.utc) - timedelta(days=i)).strftime("%Y-%m-%d")
        if d == expected:
            current_streak += 1
        else:
            break

    return {
        "current_streak": current_streak,
        "total_days": len(dates),
        "total_entries": len(convos),
    }


# ============================================================
#  USER STATS
# ============================================================

def get_user_stats(user_id="default_user"):
    """Get or create user statistics."""
    db = get_db()
    stats = db.user_stats.find_one({"user_id": user_id})
    
    if not stats:
        stats = {
            "user_id": user_id,
            "total_conversations": 0,
            "total_journals": 0,
            "total_gratitude": 0,
            "current_streak": 0,
            "longest_streak": 0,
            "last_active": None,
            "created_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        }
        db.user_stats.insert_one(stats)
        stats = db.user_stats.find_one({"user_id": user_id})
    
    return _id_str(stats)


def update_user_stats(user_id="default_user"):
    """Update user statistics."""
    db = get_db()
    
    convos_count = db.conversations.count_documents({"user_id": user_id})
    journal_count = db.journal.count_documents({"user_id": user_id})
    gratitude_count = db.gratitude.count_documents({"user_id": user_id})
    streaks = get_mood_streaks(user_id)
    
    db.user_stats.update_one(
        {"user_id": user_id},
        {"$set": {
            "total_conversations": convos_count,
            "total_journals": journal_count,
            "total_gratitude": gratitude_count,
            "current_streak": streaks["current_streak"],
            "longest_streak": max(streaks["current_streak"], streaks.get("longest_streak", 0)),
            "last_active": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        }},
        upsert=True
    )


# ============================================================
#  ACHIEVEMENTS / BADGES
# ============================================================

BADGE_DEFINITIONS = [
    {"badge_id": "first_chat", "name": "First Step", "desc": "Had your first conversation", "emoji": "🌱", "condition": "conversations >= 1"},
    {"badge_id": "chatter_5", "name": "Opening Up", "desc": "Completed 5 conversations", "emoji": "💬", "condition": "conversations >= 5"},
    {"badge_id": "chatter_20", "name": "Deep Thinker", "desc": "Completed 20 conversations", "emoji": "🧠", "condition": "conversations >= 20"},
    {"badge_id": "streak_3", "name": "Consistent", "desc": "3-day streak", "emoji": "🔥", "condition": "streak >= 3"},
    {"badge_id": "streak_7", "name": "Dedicated", "desc": "7-day streak", "emoji": "⭐", "condition": "streak >= 7"},
    {"badge_id": "journal_1", "name": "Journal Starter", "desc": "Wrote your first journal entry", "emoji": "📝", "condition": "journal >= 1"},
    {"badge_id": "journal_5", "name": "Storyteller", "desc": "Wrote 5 journal entries", "emoji": "📖", "condition": "journal >= 5"},
    {"badge_id": "gratitude_1", "name": "Grateful Heart", "desc": "First gratitude entry", "emoji": "🙏", "condition": "gratitude >= 1"},
    {"badge_id": "gratitude_7", "name": "Gratitude Guru", "desc": "7 gratitude entries", "emoji": "✨", "condition": "gratitude >= 7"},
]


def _check_achievements(db, user_id="default_user"):
    """Auto-check and unlock achievements based on current data."""
    convos_count = db.conversations.count_documents({"user_id": user_id})
    journal_count = db.journal.count_documents({"user_id": user_id})
    gratitude_count = db.gratitude.count_documents({"user_id": user_id})
    streaks = get_mood_streaks(user_id)
    current_streak = streaks["current_streak"]

    checks = {
        "first_chat": convos_count >= 1,
        "chatter_5": convos_count >= 5,
        "chatter_20": convos_count >= 20,
        "streak_3": current_streak >= 3,
        "streak_7": current_streak >= 7,
        "journal_1": journal_count >= 1,
        "journal_5": journal_count >= 5,
        "gratitude_1": gratitude_count >= 1,
        "gratitude_7": gratitude_count >= 7,
    }

    for badge_id, unlocked in checks.items():
        if unlocked:
            existing = db.achievements.find_one({"badge_id": badge_id, "user_id": user_id})
            if not existing:
                db.achievements.insert_one({
                    "badge_id": badge_id,
                    "user_id": user_id,
                    "unlocked_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                })


def unlock_achievement(badge_id, user_id="default_user"):
    """Manually unlock a specific achievement."""
    db = get_db()
    existing = db.achievements.find_one({"badge_id": badge_id, "user_id": user_id})
    if not existing:
        db.achievements.insert_one({
            "badge_id": badge_id,
            "user_id": user_id,
            "unlocked_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        })


def get_achievements(user_id="default_user"):
    db = get_db()
    unlocked = {doc["badge_id"]: doc["unlocked_at"] for doc in db.achievements.find({"user_id": user_id})}

    result = []
    for badge in BADGE_DEFINITIONS:
        b = {**badge}
        if badge["badge_id"] in unlocked:
            b["unlocked"] = True
            b["unlocked_at"] = unlocked[badge["badge_id"]]
        else:
            b["unlocked"] = False
            b["unlocked_at"] = None
        result.append(b)
    return result


# ============================================================
#  WEEKLY REPORT
# ============================================================

def get_weekly_report(user_id="default_user"):
    db = get_db()
    since = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat().replace("+00:00", "Z")
    week_convos = list(db.conversations.find({"user_id": user_id, "timestamp": {"$gte": since}}))

    if not week_convos:
        return {
            "total_conversations": 0,
            "dominant_emotion": None,
            "mood_trajectory": "No data yet",
            "message": "Start chatting to see your weekly report! 💬",
            "avg_severity": 0,
            "emotion_breakdown": {"Positive": 0, "Neutral": 0, "Negative": 0},
        }

    emotions = {"Positive": 0, "Neutral": 0, "Negative": 0}
    total_severity = 0
    for c in week_convos:
        emotions[c.get("emotion", "Neutral")] += 1
        total_severity += c.get("severity", 5)

    dominant = max(emotions, key=emotions.get)
    avg_severity = round(total_severity / len(week_convos), 1)

    # Trajectory — compare first vs second half of week
    mid = len(week_convos) // 2
    if mid > 0:
        score_map = {"Positive": 3, "Neutral": 2, "Negative": 1}
        first_half = sum(score_map.get(c["emotion"], 2) for c in week_convos[:mid]) / mid
        second_half = sum(score_map.get(c["emotion"], 2) for c in week_convos[mid:]) / (len(week_convos) - mid)
        if second_half > first_half + 0.3:
            trajectory = "Improving 📈"
        elif second_half < first_half - 0.3:
            trajectory = "Declining 📉"
        else:
            trajectory = "Stable 📊"
    else:
        trajectory = "Just started 🌱"

    messages = {
        "Positive": f"Great week! 🎉 You've been feeling mostly positive with {emotions['Positive']} uplifting conversations. Keep nurturing your well-being!",
        "Neutral": f"A balanced week with {len(week_convos)} check-ins. You're building self-awareness — that's powerful! 💪",
        "Negative": f"This week had some tough moments, but you showed up {len(week_convos)} times. That takes real courage. Remember: every storm passes. 🌈",
    }

    return {
        "total_conversations": len(week_convos),
        "dominant_emotion": dominant,
        "mood_trajectory": trajectory,
        "message": messages.get(dominant, "Keep going! 🌟"),
        "avg_severity": avg_severity,
        "emotion_breakdown": emotions,
    }


# ============================================================
#  DAILY QUOTES
# ============================================================

QUOTES = [
    {"text": "You are braver than you believe, stronger than you seem, and smarter than you think.", "author": "A.A. Milne"},
    {"text": "The only way out is through.", "author": "Robert Frost"},
    {"text": "You don't have to control your thoughts. You just have to stop letting them control you.", "author": "Dan Millman"},
    {"text": "Mental health is not a destination, but a process. It's about how you drive, not where you're going.", "author": "Noam Shpancer"},
    {"text": "Your present circumstances don't determine where you can go; they merely determine where you start.", "author": "Nido Qubein"},
    {"text": "It's okay to not be okay, as long as you are not giving up.", "author": "Karen Salmansohn"},
    {"text": "Healing takes time, and asking for help is a courageous step.", "author": "Mariska Hargitay"},
    {"text": "You are not your illness. You have an individual story to tell. You have a name, a history, a personality.", "author": "Julian Seifter"},
    {"text": "There is hope, even when your brain tells you there isn't.", "author": "John Green"},
    {"text": "Self-care is how you take your power back.", "author": "Lalah Delia"},
    {"text": "What lies behind us and what lies before us are tiny matters compared to what lies within us.", "author": "Ralph Waldo Emerson"},
    {"text": "The wound is the place where the Light enters you.", "author": "Rumi"},
    {"text": "Stars can't shine without darkness.", "author": "D.H. Sidebottom"},
    {"text": "You were given this life because you are strong enough to live it.", "author": "Robin Sharma"},
    {"text": "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.", "author": "Unknown"},
    {"text": "Sometimes the bravest thing you can do is ask for help.", "author": "Unknown"},
    {"text": "Breathe. You're going to be okay. Breathe and remember that you've been in this place before.", "author": "Unknown"},
    {"text": "Not until we are lost do we begin to understand ourselves.", "author": "Henry David Thoreau"},
    {"text": "The strongest people are not those who show strength in front of us, but those who win battles we know nothing about.", "author": "Unknown"},
    {"text": "Every day may not be good, but there is something good in every day.", "author": "Alice Morse Earle"},
    {"text": "You are allowed to be both a masterpiece and a work in progress simultaneously.", "author": "Sophia Bush"},
    {"text": "Tough times never last but tough people do.", "author": "Robert H. Schuller"},
    {"text": "Don't believe everything you think.", "author": "Byron Katie"},
    {"text": "The darkest hour has only sixty minutes.", "author": "Morris Mandel"},
    {"text": "Fall seven times, stand up eight.", "author": "Japanese Proverb"},
    {"text": "You are enough just as you are.", "author": "Meghan Markle"},
    {"text": "Be gentle with yourself. You're doing the best you can.", "author": "Unknown"},
    {"text": "Promise me you'll always remember: You're braver than you believe, and stronger than you seem.", "author": "Christopher Robin"},
    {"text": "This too shall pass.", "author": "Persian Proverb"},
    {"text": "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", "author": "Unknown"},
    {"text": "In the middle of difficulty lies opportunity.", "author": "Albert Einstein"},
]


def get_daily_quote():
    """Return a different quote each day based on date."""
    day_of_year = datetime.now(timezone.utc).timetuple().tm_yday
    index = day_of_year % len(QUOTES)
    return QUOTES[index]


def delete_user_data(user_id):
    """Delete all user history and reset stats for the user."""
    db = get_db()
    print(f"🧹 [DATABASE] Clearing all data for user: {user_id}")
    res1 = db.conversations.delete_many({"user_id": user_id})
    res2 = db.journal.delete_many({"user_id": user_id})
    res3 = db.gratitude.delete_many({"user_id": user_id})
    res4 = db.achievements.delete_many({"user_id": user_id})
    res5 = db.user_stats.delete_many({"user_id": user_id})
    
    deleted_total = (res1.deleted_count + res2.deleted_count + 
                     res3.deleted_count + res4.deleted_count + 
                     res5.deleted_count)
    
    print(f"✅ [DATABASE] Deleted {deleted_total} records for {user_id}")
    return True


def delete_user_account(user_id):
    """Delete user record and all history from MongoDB."""
    db = get_db()
    db.users.delete_one({"email": user_id})
    db.conversations.delete_many({"user_id": user_id})
    db.journal.delete_many({"user_id": user_id})
    db.gratitude.delete_many({"user_id": user_id})
    db.achievements.delete_many({"user_id": user_id})
    db.user_stats.delete_many({"user_id": user_id})
    db.login_logs.delete_many({"user_id": user_id})
    print(f"🚫 [DATABASE] Account and history deleted for user: {user_id}")
    return True

def delete_user_conversations(user_id):
    """Delete only chat conversations for the user."""
    db = get_db()
    res = db.conversations.delete_many({"user_id": user_id})
    # Reset stats that depend on conversations
    db.user_stats.update_one(
        {"user_id": user_id},
        {"$set": {"total_conversations": 0, "current_streak": 0}}
    )
    print(f"💬 [DATABASE] Deleted {res.deleted_count} chats for {user_id}")
    return True