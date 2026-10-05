from fastapi import APIRouter
from app.schemas.prediction import PredictionRequest
from app.ml.predictor import predictor_service
from ml.recommendation.engine import RecommendationEngine

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("/performance")
def predict_performance(req: PredictionRequest):
    return predictor_service.predict_performance(req.dict())

@router.post("/category")
def predict_category(req: PredictionRequest):
    return RecommendationEngine.categorize_student(req.dict())
