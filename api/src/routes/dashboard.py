from fastapi import APIRouter, HTTPException

from src.dashboard.models import (
    Dashboard,
    DashboardRequest,
)
from src.dashboard.service import (
    generate_dashboard,
)


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

    except Exception as exc:
        print(
            f"Dashboard generation error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"Failed to generate dashboard: {exc}"
            ),
        ) from exc
