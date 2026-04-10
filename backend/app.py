from dotenv import load_dotenv
load_dotenv()  # Load variables before importing database

import os
import json
import re
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import (
    init_db, save_conversation, get_recent_moods, get_last_n_moods,
    get_all_conversations, save_journal_entry, get_journal_entries,
    get_mood_calendar, get_mood_streaks, save_gratitude_entry,
    get_gratitude_entries, get_achievements, unlock_achievement,
    get_weekly_report, get_daily_quote, save_user_login,
    delete_user_data, delete_user_account, delete_user_conversations, get_db
)

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
        print("[AI] Gemini API configured successfully")
    except Exception as e:
        print(f"[AI] Gemini setup failed: {e}")
        gemini_model = None
else:
    print("[AI] No Gemini API key found. Running in DEMO mode.")

# ---------- Improved System Prompt ----------
SYSTEM_PROMPT = """You are MindMate, a compassionate and knowledgeable AI mental health companion.

Your PRIMARY job is to ACTUALLY ANSWER the user's question or concern with specific, useful information — not just reflect their feelings back at them.

RULES:
1. ALWAYS address the exact topic the user raised (sleep, anxiety, stress, relationships, etc.)
2. ALWAYS give concrete, actionable advice or information relevant to their specific situation
3. Validate their feelings briefly (1 sentence), then spend the rest of the response being genuinely helpful
4. If they ask a question → answer it directly and completely
5. If they describe a problem → explain what causes it and give 2-3 specific techniques to help
6. If they share good news → celebrate it and help them build on it
7. If they ask a direct factual or identity question (e.g., 'What is your name?', 'How do you work?') → ANSWER DIRECTLY and IMMEDIATELY without validating their feelings first.
8. Never give vague, generic responses like "I hear you" alone — always add substance

EXAMPLES of BAD responses (never do this):
- "I hear you. Your feelings are valid. You're not alone." ← no actual help
- "Thank you for sharing. That takes courage." ← completely empty

EXAMPLES of GOOD responses (always do this):
- User: "I can't sleep well lately" → Explain that poor sleep often links to cortisol spikes, screen light, or racing thoughts. Suggest: keeping a fixed wake time, avoiding screens 1hr before bed, and the 4-7-8 breathing technique to fall asleep.
- User: "I feel anxious about work" → Ask what specifically triggers it (deadlines, people, performance?), explain that work anxiety often comes from unclear expectations or perfectionism, and suggest the "worry window" technique — scheduling 15 mins daily to process anxious thoughts so they don't bleed into the whole day.
- User: "I'm feeling stressed" → Distinguish between acute vs chronic stress, explain what's happening physiologically (cortisol, fight-or-flight), and give the STOP technique: Stop, Take a breath, Observe what's happening, Proceed mindfully.

RESPONSE FORMAT — respond with ONLY valid JSON, no markdown, no extra text:
{
  "emotion": "Positive" or "Neutral" or "Negative",
  "severity": <integer 1-10>,
  "empathetic_response": "<2-4 sentences: 1 sentence acknowledging their feeling, then 2-3 sentences of specific, useful, actionable information directly addressing what they said>",
  "recommendation": "<one ultra-specific actionable tip, max 12 words, not generic>"
}

Severity scale: 1-3 = mild/positive, 4-6 = moderate concern, 7-8 = significant distress, 9-10 = crisis."""


# ============================================================
#  DEMO MODE RESPONSES (Specific, Helpful, Topic-Aware)
# ============================================================

# Topic-specific fallback responses when Gemini is unavailable
TOPIC_RESPONSES = {
    "sleep": {
        "emotion": "Negative",
        "severity": 5,
        "empathetic_response": "Sleep struggles are really draining — your body and mind need that rest. Poor sleep is often caused by inconsistent wake times, blue light from screens, or a racing mind at bedtime. Try keeping a fixed wake-up time even on weekends, avoid screens 45 minutes before bed, and practice the 4-7-8 breathing method: inhale for 4 counts, hold for 7, exhale for 8.",
        "recommendation": "Set a fixed wake time and do 4-7-8 breathing tonight.",
    },
    "anxious|anxiety": {
        "emotion": "Negative",
        "severity": 6,
        "empathetic_response": "Anxiety is genuinely uncomfortable, and I'm glad you're addressing it. It often stems from uncertainty, perfectionism, or feeling like demands exceed your resources. A proven technique is the 'worry window': set aside 15 minutes each day specifically to process anxious thoughts, so they don't spill into your whole day. When anxiety hits outside that window, note it down and save it for later.",
        "recommendation": "Try the worry window: 15 mins daily to process anxious thoughts.",
    },
    "stress|stressed": {
        "emotion": "Negative",
        "severity": 6,
        "empathetic_response": "Stress takes a real toll when it piles up — your body is literally in fight-or-flight mode. The STOP technique can help in the moment: Stop what you're doing, Take one slow breath, Observe what's happening in your body and thoughts without judgment, then Proceed mindfully. For longer-term stress, try identifying your top stressor and breaking it into the single next smallest action.",
        "recommendation": "Use STOP: Stop, Take a breath, Observe, Proceed mindfully.",
    },
    "lonely|alone|isolated": {
        "emotion": "Negative",
        "severity": 6,
        "empathetic_response": "Loneliness is one of the most painful feelings, and it's more common than most people admit. Research shows that even brief, low-stakes interactions — a text to an old friend, joining an online community around a hobby, or a walk in a busy area — can meaningfully reduce it. You don't need deep connection right away; small moments of feeling seen add up.",
        "recommendation": "Send one message to someone you haven't talked to recently.",
    },
    "depress|hopeless|worthless|empty|numb": {
        "emotion": "Negative",
        "severity": 8,
        "empathetic_response": "What you're feeling sounds really heavy, and I want you to know it makes sense that you'd feel this way — depression flattens everything. One small but evidence-backed step is behavioral activation: do one tiny enjoyable or meaningful action today, even if you don't feel like it, because action often comes before motivation (not after). Please also consider speaking to a counselor — iCall (9152987821) offers free sessions.",
        "recommendation": "Do one small enjoyable thing today — action sparks motivation.",
    },
    "angry|frustrated|rage": {
        "emotion": "Negative",
        "severity": 6,
        "empathetic_response": "Anger makes complete sense when your boundaries are crossed or things feel unfair. To cool the physiological response quickly, try the 'cold water reset': splash cold water on your face or hold ice — it activates the dive reflex and slows your heart rate within seconds. Once calmer, ask yourself: what unmet need or threat is underneath this anger?",
        "recommendation": "Splash cold water on your face to activate the calm reflex.",
    },
    "panic|overwhelm|overwhelmed": {
        "emotion": "Negative",
        "severity": 7,
        "empathetic_response": "Feeling overwhelmed is your brain's way of saying there's too much in the queue at once. The 5-4-3-2-1 grounding technique works well right now: name 5 things you can see, 4 you can physically touch, 3 you hear, 2 you can smell, 1 you can taste. This pulls your nervous system out of panic mode by anchoring you in the present.",
        "recommendation": "Do 5-4-3-2-1 grounding: name things you see, touch, hear.",
    },
    "tired|exhausted|burnout": {
        "emotion": "Negative",
        "severity": 5,
        "empathetic_response": "Exhaustion — especially emotional exhaustion — is a real signal that your system needs recovery, not just more sleep. Rest comes in many forms: physical (sleep, stillness), mental (no problem-solving), social (time alone if drained), and creative (making something). Identify which type of rest you're most depleted in and prioritize that specifically today.",
        "recommendation": "Identify your rest type: physical, mental, social, or creative.",
    },
    "happy|great|wonderful|amazing|excited|good|grateful|joy|awesome|proud|blessed|peaceful|hopeful|inspired|content": {
        "emotion": "Positive",
        "severity": 2,
        "empathetic_response": "That's genuinely wonderful — hold onto this feeling. Positive emotions actually broaden your thinking and build long-term resilience, so this isn't just a nice moment, it's doing real good. Consider anchoring it: write down specifically what contributed to this feeling so you can intentionally create more of those conditions.",
        "recommendation": "Write what caused this feeling — recreate those conditions.",
    },
    "who are you|your name|what is your name|who is mindmate|what is mindmate": {
        "emotion": "Positive",
        "severity": 1,
        "empathetic_response": "I'm MindMate, your AI mental health companion! I'm designed to listen, support you, and help you understand your emotional patterns better. You can talk to me about your feelings, keep a journal, or track your mood and streaks on the dashboard.",
        "recommendation": "Ask me how I can help with your stress or sleep!",
    },
    "how are you|how do you feel": {
        "emotion": "Positive",
        "severity": 1,
        "empathetic_response": "I'm doing great and I'm ready to support you! As an AI, I don't have feelings in the human sense, but I'm fully dedicated to being here for you and helping you navigate whatever is on your mind today.",
        "recommendation": "Tell me about one thing that happened in your day today.",
    },
}

CRISIS_KEYWORDS = ["suicide", "kill myself", "end my life", "self-harm", "hurt myself", "don't want to live", "want to die", "no reason to live"]


def get_fallback_response(message, history_text=""):
    """Topic-aware fallback responses when Gemini is unavailable."""
    msg_lower = message.lower()

    # Crisis check first
    if any(kw in msg_lower for kw in CRISIS_KEYWORDS):
        return {
            "emotion": "Negative",
            "severity": 10,
            "empathetic_response": "I hear you, and I'm taking what you said seriously — your life has value even when it doesn't feel that way. Please reach out to a crisis counselor right now who is trained to help with exactly this. In India, iCall is available at 9152987821 (Mon–Sat 8am–10pm) and AASRA at 9820466627 (24/7). In the US, call or text 988.",
            "recommendation": "Call AASRA 9820466627 (India) or 988 (US) right now.",
        }

    # Match topic keywords for specific responses
    for keywords, response in TOPIC_RESPONSES.items():
        if any(kw in msg_lower for kw in keywords.split("|")):
            return response

    # Generic neutral fallback
    neutral_responses = [
        {
            "empathetic_response": "I'm listening and I'm here to support you in whatever way I can. Could you tell me more about what's going on or what exactly is on your mind? The more you share, the better I can help you process things.",
            "recommendation": "Tell me more — what's the primary thing you're thinking about?",
            "severity": 3,
        },
        {
            "empathetic_response": "I hear you, and I'm dedicated to helping you navigate this. Sometimes it helps to break down what you're feeling into specific thoughts or situations — what's the one thing that stands out most to you right now?",
            "recommendation": "Try to pinpoint the specific thought that's most present.",
            "severity": 3,
        },
    ]
    choice = random.choice(neutral_responses)
    return {"emotion": "Neutral", **choice}


def call_gemini(user_message, history_text=""):
    """Call the Gemini API and parse the response."""
    if gemini_model is None:
        return get_fallback_response(user_message, history_text)

    try:
        prompt = SYSTEM_PROMPT + "\n\n"

        if history_text:
            prompt += f"User's recent conversation history (for context only — still focus on their current message):\n{history_text}\n\n"

        prompt += f"User's current message: {user_message}\n\nRespond with ONLY the JSON object."

        response = gemini_model.generate_content(prompt)
        text = response.text.strip()

        # Strip markdown code fences if present
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)

        result = json.loads(text)
        result["severity"] = int(result.get("severity", 5))

        # Validate required fields
        if "empathetic_response" not in result or not result["empathetic_response"].strip():
            raise ValueError("Empty response from Gemini")

        return result

    except Exception as e:
        print(f"Gemini error: {e}")
        return get_fallback_response(user_message, history_text)


# ============================================================
#  ROUTES
# ============================================================

@app.route("/api/login", methods=["POST"])
def login_track():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    user_id = save_user_login(data)
    return jsonify({"message": "Login successful", "user_id": user_id})


@app.route("/api/auth/github", methods=["POST"])
def github_auth():
    """Placeholder for GitHub OAuth logic."""
    data = request.get_json()
    code = data.get("code")
    
    mock_user = {
        "name": "GitHub User",
        "email": f"github_{code[:8]}@example.com",
        "provider": "github"
    }
    
    return jsonify({
        "token": "mock_github_token",
        "user": mock_user
    })


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    user_id = data.get("user_id", "default_user")

    # Build recent history for context (chronological order)
    recent_moods = get_last_n_moods(5, user_id=user_id)
    history_lines = [
        f"- User said: \"{m.get('user_message', '')}\" | Emotion: {m.get('emotion', '')} | Severity: {m.get('severity', '')}"
        for m in reversed(recent_moods)
        if m.get('user_message')
    ]
    history_text = "\n".join(history_lines)

    result = call_gemini(user_message, history_text)

    entry_id = save_conversation(
        user_message=user_message,
        ai_response=result["empathetic_response"],
        emotion=result["emotion"],
        severity=result["severity"],
        recommendation=result.get("recommendation", ""),
        user_id=user_id
    )

    # Crisis threshold: severity >= 8 AND negative emotion, OR any crisis keyword hit
    crisis_keywords_hit = any(kw in user_message.lower() for kw in CRISIS_KEYWORDS)
    is_crisis = crisis_keywords_hit or (result["severity"] >= 8 and result["emotion"] == "Negative")

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
        response_data["crisis_message"] = "Crisis helplines: AASRA 9820466627 | iCall 9152987821 (India) | 988 (US) | 116 123 (UK)"

    return jsonify(response_data)


@app.route("/api/mood", methods=["GET"])
def mood_data():
    days = request.args.get("days", 7, type=int)
    user_id = request.args.get("user_id", "default_user")
    moods = get_recent_moods(days, user_id=user_id)

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
    user_id = request.args.get("user_id", "default_user")
    recent = get_last_n_moods(5, user_id=user_id)

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
    user_id = request.args.get("user_id", "default_user")
    convos = get_all_conversations(user_id=user_id)
    return jsonify({"conversations": convos})


@app.route("/api/journal", methods=["POST"])
def create_journal():
    data = request.get_json()
    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    mood = data.get("mood", "Neutral")

    if not content:
        return jsonify({"error": "Content is required"}), 400

    user_id = data.get("user_id", "default_user")
    entry_id = save_journal_entry(title=title, content=content, mood=mood, user_id=user_id)
    return jsonify({"id": entry_id, "message": "Journal saved!"})


@app.route("/api/journal", methods=["GET"])
def list_journal():
    user_id = request.args.get("user_id", "default_user")
    entries = get_journal_entries(user_id=user_id)
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

    user_id = data.get("user_id", "default_user")
    entry_id = save_gratitude_entry(items, user_id=user_id)
    return jsonify({"id": entry_id, "message": "Gratitude saved!"})


@app.route("/api/gratitude", methods=["GET"])
def list_gratitude():
    user_id = request.args.get("user_id", "default_user")
    entries = get_gratitude_entries(user_id=user_id)
    return jsonify({"entries": entries})


@app.route("/api/calendar", methods=["GET"])
def calendar_data():
    days = request.args.get("days", 30, type=int)
    user_id = request.args.get("user_id", "default_user")
    data = get_mood_calendar(user_id=user_id, days=days)
    return jsonify({"calendar": data})


@app.route("/api/streaks", methods=["GET"])
def streaks():
    user_id = request.args.get("user_id", "default_user")
    streak_data = get_mood_streaks(user_id=user_id)
    return jsonify(streak_data)


@app.route("/api/achievements", methods=["GET"])
def achievements():
    user_id = request.args.get("user_id", "default_user")
    badges = get_achievements(user_id=user_id)
    return jsonify({"achievements": badges})


@app.route("/api/achievements/unlock", methods=["POST"])
def manual_unlock():
    data = request.get_json()
    badge_id = data.get("badge_id", "")
    user_id = data.get("user_id", "default_user")
    if badge_id:
        unlock_achievement(badge_id, user_id=user_id)
    return jsonify({"message": "Achievement unlocked!"})


@app.route("/api/weekly-report", methods=["GET"])
def weekly_report():
    user_id = request.args.get("user_id", "default_user")
    report = get_weekly_report(user_id=user_id)
    return jsonify(report)


@app.route("/api/quotes", methods=["GET"])
def daily_quote():
    quote = get_daily_quote()
    return jsonify(quote)


@app.route("/api/user/data", methods=["DELETE"])
def clear_data():
    user_id = request.args.get("user_id", "default_user")
    delete_user_data(user_id)
    return jsonify({"message": "All mood data has been cleared."})


@app.route("/api/user/account", methods=["DELETE"])
def delete_account():
    user_id = request.args.get("user_id", "default_user")
    delete_user_account(user_id)
    return jsonify({"message": "Account and history deleted successfully."})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "ai_mode": "gemini" if gemini_model else "demo",
        "database": "MongoDB Atlas",
    })


@app.route("/api/history", methods=["GET"])
def get_history():
    user_id = request.args.get("user_id", "default_user")
    db = get_db()
    
    conversations = list(db.conversations.find({"user_id": user_id}).sort("timestamp", -1))
    journal = list(db.journal.find({"user_id": user_id}).sort("timestamp", -1))
    gratitude = list(db.gratitude.find({"user_id": user_id}).sort("timestamp", -1))
    
    history = []
    
    for c in conversations:
        history.append({
            "id": str(c["_id"]),
            "type": "chat",
            "date": c["timestamp"],
            "emotion": c.get("emotion"),
            "severity": c.get("severity"),
            "last_message": c.get("user_message", ""),
            "messages_count": 1
        })
        
    for j in journal:
        history.append({
            "id": str(j["_id"]),
            "type": "journal",
            "date": j["timestamp"],
            "mood": j.get("mood"),
            "title": j.get("title"),
            "text": j.get("content")
        })
        
    for g in gratitude:
        history.append({
            "id": str(g["_id"]),
            "type": "gratitude",
            "date": g["timestamp"],
            "items": g.get("items", [])
        })
        
    history.sort(key=lambda x: x["date"], reverse=True)
    
    return jsonify({"history": history})


@app.route("/api/user/conversations", methods=["DELETE"])
def clear_conversations():
    user_id = request.args.get("user_id", "default_user")
    delete_user_conversations(user_id)
    return jsonify({"message": "Chat history has been cleared."})


if __name__ == "__main__":
    init_db()
    print("\n[SERVER] MindMate Backend running on http://localhost:5000")
    print(f"   AI Mode: {'Gemini API' if gemini_model else 'Demo'}")
    print(f"   Database: MongoDB Atlas\n")
    app.run(host='0.0.0.0', debug=True, port=5000, use_reloader=False)