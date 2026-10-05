import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Add parent path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import settings
from app.database.mongodb import connect_to_mongo, close_mongo_connection
from app.routes import auth, students, assessment, prediction, recommendation, dashboard, ml, data, reports, courses, counsellor, cse, ece, eee, aids, mech, data_science, psychology, bba, environmental_science, journalism, written_assessments, pilot_validation, commerce

@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_to_mongo()
    yield
    close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="2.0.0",
    description="Data-Driven 12th Standard Course & Career Guidance System API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(assessment.router, prefix=settings.API_V1_STR)
app.include_router(prediction.router, prefix=settings.API_V1_STR)
app.include_router(recommendation.router, prefix=settings.API_V1_STR)
app.include_router(courses.router, prefix=settings.API_V1_STR)
app.include_router(counsellor.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(ml.router, prefix=settings.API_V1_STR)
app.include_router(data.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(cse.router, prefix=settings.API_V1_STR)
app.include_router(ece.router, prefix=settings.API_V1_STR)
app.include_router(eee.router, prefix=settings.API_V1_STR)
app.include_router(aids.router, prefix=settings.API_V1_STR)
app.include_router(mech.router, prefix=settings.API_V1_STR)
app.include_router(mech.admin_router, prefix=settings.API_V1_STR)
app.include_router(data_science.router, prefix=settings.API_V1_STR)
app.include_router(psychology.router, prefix=settings.API_V1_STR)
app.include_router(bba.router, prefix=settings.API_V1_STR)
app.include_router(environmental_science.router, prefix=settings.API_V1_STR)
app.include_router(journalism.router, prefix=settings.API_V1_STR)
app.include_router(commerce.router, prefix=settings.API_V1_STR)
app.include_router(written_assessments.router, prefix=settings.API_V1_STR)
app.include_router(pilot_validation.router, prefix=settings.API_V1_STR)



@app.get("/")
def root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": "2.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
