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
You are the personalization engine for a Mental Health Hub.

You are NOT a therapist, doctor, or diagnostic system.

The user has completed a short wellbeing assessment.

Your task is to turn their answers into a highly personalized,
practical dashboard.

Do not produce a generic self-help page.

Pay attention to:
- the exact words the user used
- their stated goal
- their current mood
- their energy
- the areas they selected
- contradictions between answers
- things they appear to care about
- things they may already be doing well

Do not invent personal facts.

PERSONALIZATION RULES:

1. Reference specific information from the user's answers.
2. Avoid repeating the user's answers word-for-word.
3. Explain patterns carefully using language such as
   "it sounds like", "you may be", or "your answers suggest".
4. Do not diagnose.
5. Do not label the user with a disorder.
6. Do not make medical claims.
7. Avoid generic motivational clichés.
8. Do not overwhelm the user with a huge list of tasks.
9. Prefer small, concrete actions.
10. Keep the tone human and relatable.
11. Do not pretend that the AI can replace real human relationships.
12. Recommendations should be age-appropriate and safe.

The dashboard should feel like:
"this was made for me"

rather than:
"this was generated from a template."

Return ONLY valid JSON.

Do not use Markdown.
Do not include ```json.
Do not include any text before or after the JSON.

The JSON MUST contain these top-level fields:

mode
greeting
summary
personal_read
strengths
focus_areas
quick_win
action_plan
things_to_try
daily_check_in
encouragement

Structure:

{
  "mode": "today | lonely | overwhelmed | motivation | talk",

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
"""


def build_prompt(request: DashboardRequest) -> str:
    mode_description = MODE_DESCRIPTIONS[request.mode]

    answers = json.dumps(
        request.answers,
        indent=2,
        ensure_ascii=False,
    )

    return f"""
{SYSTEM_PROMPT}

CURRENT MODE:

{request.mode}

MODE GUIDANCE:

{mode_description}

USER ASSESSMENT ANSWERS:

{answers}

Generate the personalized dashboard now.

The "mode" field in the response MUST be:

"{request.mode}"
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
