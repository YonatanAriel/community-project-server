class RequestValidator {
  static validateRecommendationRequest(req) {
    const { query, input_text } = req.body;
    const userQuery = query || input_text;

    if (
      !userQuery ||
      typeof userQuery !== "string" ||
      userQuery.trim().length === 0
    ) {
      return {
        isValid: false,
        error: "Query is required and must be a non-empty string",
        userQuery: null,
      };
    }

    return {
      isValid: true,
      error: null,
      userQuery: userQuery.trim(),
    };
  }
}

export default RequestValidator;
