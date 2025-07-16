import express from "express";
import GeminiService from "../BL/services/gemini.service.js";
import RequestValidator from "../BL/utils/requestValidator.js";
import RecommendationBuilder from "../BL/services/recommendationBuilder.service.js";
import ErrorHandler from "../BL/utils/errorHandler.js";
import { authenticateToken } from "../BL/utils/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", async (req, res) => {
  try {
    console.log("🔍 Received AI recommendation request:", req.body);

    const validation = RequestValidator.validateRecommendationRequest(req);
    if (!validation.isValid) {
      return ErrorHandler.handleValidationError(res, validation.error);
    }

    const result = await GeminiService.getRecommendations(validation.userQuery);
    if (result.error) {
      return ErrorHandler.handleGeminiError(res, result.error);
    }

    const recommendations = await RecommendationBuilder.buildRecommendations(
      result.userIds
    );

    res.json({
      recommendations: recommendations,
    });
  } catch (error) {
    return ErrorHandler.handleGenericError(res, error);
  }
});

export default router;
