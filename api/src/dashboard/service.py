import json

from src.dashboard.models import Dashboard, DashboardRequest
from src.llm.client import generate


MODE_DESCRIPTIONS = {
    "today": """
The user wants help with today specifically.

Prioritize:
- making today feel manageable
- one or two realistic priorities
- reducing unnecessary pressure
- a small achievable win
""",
    "lonely": """
The user is feeling lonely or disconnected.

Prioritize:
- emotional acknowledgment
- gentle connection
- small social steps
- making the user feel understood without pretending to replace real relationships
""",
    "overwhelmed": """
The user feels overwhelmed.

Prioritize:
- reducing cognitive load
- separating urgent from non-urgent things
- one small next action
- grounding and simple routines
""",
    "motivation": """
The user is struggling with motivation.

Prioritize:
- reducing the size of the first step
- identifying friction
- starting rather than waiting to feel motivated
- realistic momentum-building actions
""",
    "talk": """
The user wants somewhere to put their thoughts.

Prioritize:
- understanding what is bothering them
- reflective questions
- emotional clarity
- practical next steps only where appropriate
""",
}


SYSTEM_PROMPT = """
You generate personalized dashboards for a Mental Health Hub.

You are not a therapist, doctor, or diagnostic system.
Do not diagnose, label disorders, make medical claims, or present yourself as a replacement for human support.

Your job is to transform the user's assessment answers into a concise, personalized, practical dashboard.

PERSONALIZATION:
- Base every recommendation on information actually present in the assessment.
- Notice the user's mood, energy, goals, selected areas, exact wording, strengths, and possible tensions between answers.
- Use cautious language such as "it sounds like", "your answers suggest", or "you may be".
- Do not invent facts, circumstances, relationships, symptoms, or experiences.
- Do not simply repeat the assessment answers.
- Avoid generic self-help clichés.
- Prefer small, concrete, achievable actions.
- Do not overload the user with tasks.
- Keep recommendations age-appropriate and safe.
- Never imply that AI can replace real relationships or professional care.

STYLE:
- Human, specific, calm, and relatable.
- Personalized rather than templated.
- Concise.
- Most descriptions should be 1-2 sentences.
- Action descriptions should be short and practical.
- Use plain text only.

OUTPUT RULES:
- Return ONLY one valid JSON object.
- No Markdown.
- No code fences.
- No commentary before or after the JSON.
- Use double quotes for all JSON keys and string values.
- Never include trailing commas.
- Escape quotes inside strings correctly.
- Do not output newlines inside JSON string values.
- Do not truncate any string.
- Complete every required field before finishing.

The response MUST match this exact structure:

{
  "mode": "string",
  "greeting": {
    "title": "string",
    "message": "string"
  },
  "summary": {
    "headline": "string",
    "description": "string"
  },
  "personal_read": {
    "headline": "string",
    "description": "string"
  },
  "strengths": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "focus_areas": [
    {
      "title": "string",
      "priority": "low | medium | high",
      "description": "string"
    }
  ],
  "quick_win": {
    "title": "string",
    "description": "string",
    "duration": "string"
  },
  "action_plan": [
    {
      "step": 1,
      "title": "string",
      "description": "string",
      "actions": ["string"]
    }
  ],
  "things_to_try": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "daily_check_in": {
    "question": "string",
    "type": "reflection | mood | gratitude | intention"
  },
  "encouragement": {
    "title": "string",
    "message": "string"
  }
}

CONTENT LIMITS:
- strengths: 2-3 items
- focus_areas: 1-3 items
- action_plan: exactly 3 steps
- actions per action_plan step: 1-3 items
- things_to_try: 2-3 items
- Keep each title under 80 characters.
- Keep each description under 300 characters.
- Keep each message under 300 characters.
- Keep each action under 160 characters.
- Keep the entire response concise enough to fit comfortably within the model's output limit.

The "mode" field MUST exactly match the supplied current mode.
"""


def build_prompt(request: DashboardRequest) -> str:
    mode_description = MODE_DESCRIPTIONS.get(request.mode)

    if not mode_description:
        raise ValueError(f"Unsupported dashboard mode: {request.mode}")

    answers = json.dumps(
        request.answers,
        ensure_ascii=False,
        separators=(",", ":"),
    )

    return f"""
{SYSTEM_PROMPT}

CURRENT MODE:
{request.mode}

MODE PRIORITIES:
{mode_description}

USER ASSESSMENT:
{answers}

FINAL REQUIREMENTS:
1. Personalize the dashboard using the assessment.
2. Follow the exact JSON structure.
3. Keep all content concise.
4. Return valid, complete JSON only.
5. Set "mode" to "{request.mode}".
"""


def generate_dashboard(
    request: DashboardRequest,
) -> Dashboard:
    prompt = build_prompt(request)

    raw_response = generate(prompt)

    print("LLM RESPONSE:")
    print(raw_response)

    dashboard_data = json.loads(raw_response)

    return Dashboard.model_validate(dashboard_data)
