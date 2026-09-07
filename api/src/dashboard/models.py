from typing import Literal

from pydantic import BaseModel, Field


class DashboardRequest(BaseModel):
    answers: dict[str, str | list[str] | int | float]


class Greeting(BaseModel):
    title: str
    message: str


class Summary(BaseModel):
    headline: str
    description: str


class FocusArea(BaseModel):
    title: str
    priority: Literal["low", "medium", "high"]
    description: str


class ActionPlanStep(BaseModel):
    step: int
    title: str
    description: str
    actions: list[str] = Field(min_length=1)


class DailyCheckIn(BaseModel):
    question: str
    type: Literal["reflection", "mood", "gratitude"]


class Encouragement(BaseModel):
    title: str
    message: str


class Dashboard(BaseModel):
    greeting: Greeting
    summary: Summary

    strengths: list[str] = Field(min_length=1)

    focus_areas: list[FocusArea] = Field(
        min_length=1,
        max_length=5,
    )

    action_plan: list[ActionPlanStep] = Field(
        min_length=1,
        max_length=7,
    )

    daily_check_in: DailyCheckIn

    encouragement: Encouragement
