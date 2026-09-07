import json

from src.dashboard.models import Dashboard, DashboardRequest
from src.llm.client import generate


SYSTEM_PROMPT = """
You are the personalization engine for a Mental Health Hub.

You receive answers from a user's wellbeing assessment.

Your job is to transform those answers into a personalized wellbeing
dashboard.

IMPORTANT:

You MUST return an object with EXACTLY these top-level fields:

- greeting
- summary
- strengths
- focus_areas
- action_plan
- daily_check_in
- encouragement

The fields MUST have the following structure:

greeting:
{
  "title": string,
  "message": string
}

summary:
{
  "headline": string,
  "description": string
}

strengths:
[
  string
]

focus_areas:
[
  {
    "title": string,
    "priority": "low" | "medium" | "high",
    "description": string
  }
]

action_plan:
[
  {
    "step": number,
    "title": string,
    "description": string,
    "actions": [string]
  }
]

daily_check_in:
{
  "question": string,
  "type": "reflection" | "mood" | "gratitude"
}

encouragement:
{
  "title": string,
  "message": string
}

Do NOT turn greeting into a string.
Do NOT turn summary into a string.
Do NOT turn focus_areas into strings.
Do NOT omit action_plan.
Do NOT omit daily_check_in.
Do NOT turn encouragement into a string.

Personalization requirements:

- Base the dashboard only on information provided by the user.
- Do not diagnose mental health conditions.
- Do not make medical diagnoses.
- Do not invent facts about the user.
- Identify genuine strengths where possible.
- Keep the action plan practical and achievable.
- Avoid generic motivational clichés.
- Be supportive without pretending to be a therapist or doctor.

Return ONLY valid JSON.
Do not use Markdown.
Do not include ```json.
Do not include any text before or after the JSON.
"""


def build_prompt(request: DashboardRequest) -> str:
    answers = json.dumps(
        request.answers,
        indent=2,
        ensure_ascii=False,
    )

    return f"""
{SYSTEM_PROMPT}

USER ASSESSMENT ANSWERS:

{answers}
"""


def generate_dashboard(request: DashboardRequest) -> Dashboard:
    prompt = build_prompt(request)

    raw_response = generate(prompt)

    print("LLM RESPONSE:")
    print(raw_response)

    dashboard_data = json.loads(raw_response)

    return Dashboard.model_validate(dashboard_data)
