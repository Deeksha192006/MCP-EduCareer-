from typing import Dict, Any, Optional

class WeightConfigurationError(ValueError):
    """Raised when course recommendation weights do not satisfy validation constraints."""
    pass

class ScoreRangeError(ValueError):
    """Raised when assessment scores fall outside the normalized 0-100 range."""
    pass

class CourseRecommendationWeightConfig:
    """
    Central configurable weightage service for Course Recommendations.
    Initial default:
      - Game Performance: 75% (0.75)
      - Written Test Performance: 25% (0.25)
    Weights must always sum strictly to 1.0 (100%).
    """
    DEFAULT_GAME_WEIGHT = 0.75
    DEFAULT_WRITTEN_WEIGHT = 0.25

    def __init__(self):
        self._game_weight = self.DEFAULT_GAME_WEIGHT
        self._written_weight = self.DEFAULT_WRITTEN_WEIGHT

    @property
    def game_weight(self) -> float:
        return self._game_weight

    @property
    def written_weight(self) -> float:
        return self._written_weight

    def get_weights(self) -> Dict[str, float]:
        return {
            "game_weight": self._game_weight,
            "written_test_weight": self._written_weight
        }

    def update_weights(self, game_weight: float, written_weight: float) -> Dict[str, float]:
        """
        Updates weights after verifying bounds and that the sum equals 1.0 (100%).
        """
        if not (0.0 <= game_weight <= 1.0) or not (0.0 <= written_weight <= 1.0):
            raise WeightConfigurationError("Individual weights must be between 0.0 and 1.0.")

        total = round(game_weight + written_weight, 4)
        if abs(total - 1.0) > 1e-4:
            raise WeightConfigurationError(f"Weights must sum strictly to 1.0 (100%). Received sum: {total}")

        self._game_weight = round(game_weight, 4)
        self._written_weight = round(written_weight, 4)
        return self.get_weights()

    def reset_to_default(self) -> Dict[str, float]:
        self._game_weight = self.DEFAULT_GAME_WEIGHT
        self._written_weight = self.DEFAULT_WRITTEN_WEIGHT
        return self.get_weights()

    def calculate_course_match(
        self,
        game_score: float,
        written_test_score: float,
        custom_weights: Optional[Dict[str, float]] = None
    ) -> float:
        """
        Applies formula: Final Course Match Score = (Game Score * W_game) + (Written Score * W_written)
        Both scores must be normalized between 0.0 and 100.0.
        """
        if game_score is None or written_test_score is None:
            raise ValueError("Both game score and written test score must be provided.")

        if not (0.0 <= float(game_score) <= 100.0):
            raise ScoreRangeError(f"Game score {game_score} is out of normalized range [0, 100].")
        if not (0.0 <= float(written_test_score) <= 100.0):
            raise ScoreRangeError(f"Written test score {written_test_score} is out of normalized range [0, 100].")

        w_g = self._game_weight
        w_w = self._written_weight

        if custom_weights:
            cg = custom_weights.get("game_weight", w_g)
            cw = custom_weights.get("written_test_weight", w_w)
            if abs(round(cg + cw, 4) - 1.0) > 1e-4:
                raise WeightConfigurationError("Custom weights must sum strictly to 1.0 (100%).")
            w_g, w_w = cg, cw

        final_score = (float(game_score) * w_g) + (float(written_test_score) * w_w)
        return round(final_score, 2)

# Global singleton instance
weight_config = CourseRecommendationWeightConfig()
