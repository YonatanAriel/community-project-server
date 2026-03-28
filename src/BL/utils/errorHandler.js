class ErrorHandler {
  static handleValidationError(res, error) {
    return res.status(400).json({ error });
  }

  static handleGeminiError(res, error) {
    return res.status(500).json({ error });
  }

  static handleGenericError(res, error) {
    console.error("Error in AI recommendations route:", error);
    return res.status(500).json({
      error: "Internal server error while processing AI recommendations",
    });
  }
}

export default ErrorHandler;
