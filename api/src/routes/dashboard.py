from fastapi import APIRouter, HTTPException

from src.dashboard.models import Dashboard, DashboardRequest
from src.dashboard.service import generate_dashboard


router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
)


@router.post(
    "/generate",
    response_model=Dashboard,
)
def create_dashboard(
    request: DashboardRequest,
) -> Dashboard:
    try:
        return generate_dashboard(request)

    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail="The LLM returned an invalid dashboard.",
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate dashboard.",
        ) from exc
