export class AppError extends Error {
  constructor(message, statusCode = 500, meta = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.meta = meta;
  }
}
