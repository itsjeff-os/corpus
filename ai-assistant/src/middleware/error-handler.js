import { logger } from "../config/logger.js";

export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;

  logger.error(
    {
      err: {
        name: err.name,
        message: err.message,
        stack: err.stack,
        meta: err.meta || {}
      },
      path: req.path,
      method: req.method
    },
    "request failed"
  );

  res.status(status).json({
    error: err.message || "Internal server error"
  });
}
