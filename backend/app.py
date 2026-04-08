import os
import json
import re
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database import (
    init_db, save_conversation, get_recent_moods, get_last_n_moods,
    get_all_conversations, save_journal_entry, get_journal_entries,
    get_mood_calendar, get_mood_streaks, save_gratitude_entry,
    get_gratitude_entries, get_achievements, unlock_achievement,
    get_weekly_report, get_daily_quote
)

load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------- Gemini setup ----------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
gemini_model = None

if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel("gemini-1.5-flash")
        print("✅ Gemini API configured successfully")
    except Exception as e:
        print(f"⚠️  Gemini setup failed: {e}")
        gemini_model = None
else:
    print("⚠️  No Gemini API key found. Running in DEMO mode.")

# ---------- Enhanced Prompt for Motivational Responses ----------
SYSTEM_PROMPT = """You are MindMate, a compassionate AI mental health companion.
Analyze the user's history if provided, select a response strategy (Empathy, Guidance, Motivation), and generate an empathetic and context-aware response.
If the user is feeling negative emotions, motivate them and keep them in a better, positive feeling.

Respond with ONLY valid JSON:
{
  "emotion": "Positive" or "Neutral" or "Negative",
  "severity": 1-10,
  "empathetic_response": "warm, motivational, and empathetic response (2-3 sentences)",
  "recommendation": "short actionable coping tip (max 10 words)"
}

Keep responses compassionate and uplifting. Be direct and caring."""


# ============================================================
#  DEMO MODE RESPONSES (Concise, Minimal Emojis)
# ============================================================

def get_fallback_response(message, history_text=""):
    """Concise motivational response system with minimal emojis."""
    msg_lower = message.lower()

    # --- Crisis Detection ---
    crisis_keywords = ["suicide", "kill myself", "end my life", "self-harm", "hurt myself", "don't want to live", "want to die"]
    if any(kw in msg_lower for kw in crisis_keywords):
        return {
            "emotion": "Negative",
            "severity": 10,
            "empathetic_response": "I hear you. Your life matters. Please reach out to a crisis counselor now.",
            "recommendation": "Call 988 (US) or iCall 9152987821 (India). Help is available 24/7.",
        }

    # --- Positive Responses (Concise) ---
    positive_keywords = ["happy", "great", "wonderful", "amazing", "love", "excited", "grateful",
                         "thankful", "joy", "good day", "awesome", "fantastic", "proud", "accomplished",
                         "blessed", "peaceful", "calm", "hopeful", "inspired", "content"]
    if any(kw in msg_lower for kw in positive_keywords):
        responses = [
            {
                "empathetic_response": "That's wonderful to hear! I'm so happy for you.",
                "recommendation": "Journal this moment. Save it for later.",
                "severity": 2,
            },
            {
                "empathetic_response": "Your positivity is inspiring. Keep shining!",
                "recommendation": "Share your joy with someone today.",
                "severity": 2,
            },
            {
                "empathetic_response": "Love this energy! You deserve this happiness.",
                "recommendation": "Do a 2-minute gratitude meditation.",
                "severity": 2,
            },
        ]
        choice = random.choice(responses)
        return {"emotion": "Positive", **choice}

    # --- Negative Responses (Concise, Minimal Emojis) ---
    negative_keywords = ["sad", "depressed", "anxious", "stressed", "worried", "lonely", "angry",
                         "frustrated", "tired", "exhausted", "overwhelmed", "hopeless", "scared",
                         "afraid", "panic", "crying", "broken", "worthless", "empty", "numb",
                         "hate", "terrible", "horrible", "miserable", "pain", "suffering",
                         "can't take", "falling apart", "giving up", "lost", "stuck",
                         "not feeling well", "not good", "feeling low", "feeling down", "tension",
                         "exam", "fail", "failed", "tough"]

    if any(kw in msg_lower for kw in negative_keywords):
        severity = 7 if any(w in msg_lower for w in ["hopeless", "overwhelmed", "depressed", "worthless", "empty", "numb", "panic", "giving up", "falling apart"]) else 5

        responses = [
            {
                "empathetic_response": "I hear you. Your feelings are valid. You're not alone.",
                "recommendation": "Try box breathing: In 4, hold 4, out 4.",
            },
            {
                "empathetic_response": "Thank you for sharing. That takes real courage.",
                "recommendation": "Name 5 things you can see right now.",
            },
            {
                "empathetic_response": "This moment is hard, but it will pass. You've survived tough days before.",
                "recommendation": "Take a 10-minute walk outside.",
            },
            {
                "empathetic_response": "I'm here with you. You don't have to go through this alone.",
                "recommendation": "Drink a glass of water. Stay hydrated.",
            },
            {
                "empathetic_response": "Your pain is real, but so is your strength. Keep going.",
                "recommendation": "Write down 3 things that went right today.",
            },
            {
                "empathetic_response": "I see you struggling, and I'm proud of you for reaching out.",
                "recommendation": "Listen to your favorite song right now.",
            },
        ]
        choice = random.choice(responses)
        return {"emotion": "Negative", "severity": severity, **choice}

    # --- Neutral / Default (Concise) ---
    responses = [
        {
            "empathetic_response": "Thank you for being here. How are you really feeling today?",
            "recommendation": "Take 2 mindful breaths. Just notice.",
        },
        {
            "empathetic_response": "I appreciate you opening up. What's on your mind?",
            "recommendation": "Do a quick body scan from head to toe.",
        },
        {
            "empathetic_response": "This is your safe space. Share whatever feels right.",
            "recommendation": "Notice one thing you're grateful for.",
        },
    ]
    choice = random.choice(responses)
    return {"emotion": "Neutral", "severity": 3, **choice}


def call_gemini(user_message, history_text=""):
    """Call the Gemini API and parse the response."""
    if gemini_model is None:
        return get_fallback_response(user_message, history_text)

    try:
        prompt_with_history = f"{SYSTEM_PROMPT}\n\n"
        if history_text:
            prompt_with_history += f"Recent User History:\n{history_text}\n\n"
            prompt_with_history += "Consider the user's recent history to select an appropriate response strategy (Empathy, Guidance, Motivation).\n\n"
        prompt_with_history += f"Current User message: {user_message}"

        response = gemini_model.generate_content(prompt_with_history)
        text = response.text.strip()

        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)

        result = json.loads(text)
        result["severity"] = int(result.get("severity", 5))
        return result

    except Exception as e:
        print(f"Gemini error: {e}")
        return get_fallback_response(user_message, history_text)


# ============================================================
#  ROUTES
# ============================================================

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    recent_moods = get_last_n_moods(5)
    history_text = "\n".join([f"- User: {m.get('user_message', '')} (Emotion: {m.get('emotion', '')}, Severity: {m.get('severity', '')})" for m in recent_moods if 'user_message' in m])
    
    # Reverse history_text so chronological order makes sense (from oldest of the recent to newest)
    history_lines = history_text.split('\n')
    history_lines.reverse()
    history_text = "\n".join(history_lines)

    result = call_gemini(user_message, history_text)

    entry_id = save_conversation(
        user_message=user_message,
        ai_response=result["empathetic_response"],
        emotion=result["emotion"],
        severity=result["severity"],
        recommendation=result.get("recommendation", ""),
    )

    is_crisis = result["severity"] >= 8 and result["emotion"] == "Negative"

    response_data = {
        "id": entry_id,
        "emotion": result["emotion"],
        "severity": result["severity"],
        "empathetic_response": result["empathetic_response"],
        "recommendation": result.get("recommendation", ""),
        "is_crisis": is_crisis,
        "daily_quote": get_daily_quote(),
    }

    if is_crisis:
        response_data["crisis_message"] = "Crisis helpline: 988 (US) | iCall 9152987821 (India)"

    return jsonify(response_data)


@app.route("/api/mood", methods=["GET"])
def mood_data():
    days = request.args.get("days", 7, type=int)
    moods = get_recent_moods(days)

    emotion_score = {"Positive": 3, "Neutral": 2, "Negative": 1}
    for m in moods:
        m["score"] = emotion_score.get(m["emotion"], 2)

    avg = round(sum(m["score"] for m in moods) / len(moods), 2) if moods else 0

    if len(moods) >= 3:
        recent = [m["score"] for m in moods[-3:]]
        earlier = [m["score"] for m in moods[:max(1, len(moods) - 3)]]
        avg_recent = sum(recent) / len(recent)
        avg_earlier = sum(earlier) / len(earlier)
        if avg_recent > avg_earlier + 0.3:
            trend = "improving"
        elif avg_recent < avg_earlier - 0.3:
            trend = "needs attention"
        else:
            trend = "stable"
    else:
        trend = "building data"

    dist = {"Positive": 0, "Neutral": 0, "Negative": 0}
    for m in moods:
        dist[m["emotion"]] = dist.get(m["emotion"], 0) + 1

    return jsonify({
        "moods": moods,
        "average": avg,
        "trend": trend,
        "total_entries": len(moods),
        "distribution": dist,
    })


@app.route("/api/personalization", methods=["GET"])
def personalization():
    recent = get_last_n_moods(5)

    if not recent:
        return jsonify({
            "message": "Start chatting to get personalized suggestions!",
            "suggestions": [],
        })

    negative_count = sum(1 for m in recent if m["emotion"] == "Negative")
    positive_count = sum(1 for m in recent if m["emotion"] == "Positive")

    if negative_count >= 3:
        message = "You've been going through a tough time. Here's help:"
        suggestions = [
            {"title": "Box Breathing", "description": "Inhale 4s, hold 4s, exhale 4s. Repeat 4 times.", "icon": "🫁"},
            {"title": "5-4-3-2-1 Grounding", "description": "Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.", "icon": "🌿"},
            {"title": "Take a Walk", "description": "10 minutes outside can boost your mood.", "icon": "🚶"},
            {"title": "Reach Out", "description": "Call or text someone you trust.", "icon": "💬"},
        ]
    elif positive_count >= 3:
        message = "You've been doing great! Keep it going:"
        suggestions = [
            {"title": "Gratitude Journal", "description": "Write 3 things you're grateful for tonight.", "icon": "📓"},
            {"title": "Share Joy", "description": "Send a kind message to someone.", "icon": "💛"},
            {"title": "Set a Goal", "description": "One small goal for tomorrow.", "icon": "🎯"},
        ]
    else:
        message = "Building resilience takes time. Try these:"
        suggestions = [
            {"title": "Mindful Check-in", "description": "Notice your feelings without judgment.", "icon": "🧘"},
            {"title": "Small Routine", "description": "One consistent habit builds strength.", "icon": "📅"},
            {"title": "Creative Outlet", "description": "Draw, write, or make music.", "icon": "🎨"},
        ]

    return jsonify({
        "message": message,
        "suggestions": suggestions,
        "stats": {
            "negative": negative_count,
            "positive": positive_count,
            "neutral": 5 - negative_count - positive_count,
        },
    })


@app.route("/api/conversations", methods=["GET"])
def conversations():
    convos = get_all_conversations()
    return jsonify({"conversations": convos})


@app.route("/api/journal", methods=["POST"])
def create_journal():
    data = request.get_json()
    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    mood = data.get("mood", "Neutral")

    if not content:
        return jsonify({"error": "Content is required"}), 400

    entry_id = save_journal_entry(title=title, content=content, mood=mood)
    return jsonify({"id": entry_id, "message": "Journal saved!"})


@app.route("/api/journal", methods=["GET"])
def list_journal():
    entries = get_journal_entries()
    return jsonify({"entries": entries})


@app.route("/api/gratitude", methods=["POST"])
def create_gratitude():
    data = request.get_json()
    items = data.get("items", [])

    if not items or not isinstance(items, list):
        return jsonify({"error": "Items array is required"}), 400

    items = [i.strip() for i in items if i.strip()][:3]
    if not items:
        return jsonify({"error": "At least one gratitude item is required"}), 400

    entry_id = save_gratitude_entry(items)
    return jsonify({"id": entry_id, "message": "Gratitude saved!"})


@app.route("/api/gratitude", methods=["GET"])
def list_gratitude():
    entries = get_gratitude_entries()
    return jsonify({"entries": entries})


@app.route("/api/calendar", methods=["GET"])
def calendar_data():
    days = request.args.get("days", 30, type=int)
    data = get_mood_calendar(days)
    return jsonify({"calendar": data})


@app.route("/api/streaks", methods=["GET"])
def streaks():
    streak_data = get_mood_streaks()
    return jsonify(streak_data)


@app.route("/api/achievements", methods=["GET"])
def achievements():
    badges = get_achievements()
    return jsonify({"achievements": badges})


@app.route("/api/achievements/unlock", methods=["POST"])
def manual_unlock():
    data = request.get_json()
    badge_id = data.get("badge_id", "")
    if badge_id:
        unlock_achievement(badge_id)
    return jsonify({"message": "Achievement unlocked!"})


@app.route("/api/weekly-report", methods=["GET"])
def weekly_report():
    report = get_weekly_report()
    return jsonify(report)


@app.route("/api/quotes", methods=["GET"])
def daily_quote():
    quote = get_daily_quote()
    return jsonify(quote)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "ai_mode": "gemini" if gemini_model else "demo",
        "database": "MongoDB Atlas",
    })


if __name__ == "__main__":
    init_db()
    print("\n🧠 MindMate Backend running on http://localhost:5000")
    print(f"   AI Mode: {'Gemini API' if gemini_model else 'Demo'}")
    print(f"   Database: MongoDB Atlas\n")
    app.run(debug=True, port=5000, use_reloader=False)