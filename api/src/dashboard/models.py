from typing import Literal

from pydantic import BaseModel, Field


DashboardMode = Literal[
    "today",
    "lonely",
    "overwhelmed",
    "motivation",
    "talk",
]


class DashboardRequest(BaseModel):
    mode: DashboardMode
    answers: dict[str, str | list[str] | int | float]


class Greeting(BaseModel):
    title: str
    message: str


class Summary(BaseModel):
    headline: str
    description: str


class PersonalRead(BaseModel):
    headline: str
    description: str


class Strength(BaseModel):
    title: str
    description: str


class FocusArea(BaseModel):
    title: str
    priority: Literal["low", "medium", "high"]
    description: str


class QuickWin(BaseModel):
    title: str
    description: str
    duration: str


class ActionPlanStep(BaseModel):
    step: int
    title: str
    description: str
    actions: list[str] = Field(
        min_length=1,
        max_length=5,
    )


class TryThis(BaseModel):
    title: str
    description: str


class DailyCheckIn(BaseModel):
    question: str
    type: Literal[
        "reflection",
        "mood",
        "gratitude",
        "intention",
    ]


class Encouragement(BaseModel):
    title: str
    message: str


class Dashboard(BaseModel):
    mode: DashboardMode

    greeting: Greeting

    summary: Summary

    personal_read: PersonalRead

    strengths: list[Strength] = Field(
        min_length=1,
        max_length=4,
    )

    focus_areas: list[FocusArea] = Field(
        min_length=1,
        max_length=4,
    )

    quick_win: QuickWin

    action_plan: list[ActionPlanStep] = Field(
        min_length=2,
        max_length=6,
    )

    things_to_try: list[TryThis] = Field(
        min_length=1,
        max_length=4,
    )

    daily_check_in: DailyCheckIn

    encouragement: Encouragement
