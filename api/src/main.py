from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routes.dashboard import router as dashboard_router


app = FastAPI(
    title="Mental Health Hub API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(dashboard_router)


@app.get("/health")
def health():
    return {
        "status": "ok",
    }
