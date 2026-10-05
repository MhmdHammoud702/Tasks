import logger from "../config/logger.js";

const errorMiddleware = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    let statusCode = error.statusCode || error.status;

    if (error.name === "ValidationError" || error.name === "CastError") {
        statusCode = 400;
    } else if (error.code === 11000) {
        statusCode = 409;
    } else if (error.name === "MulterError") {
        statusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    } else if (error.type === "entity.parse.failed") {
        statusCode = 400;
    }

    if (!Number.isInteger(statusCode) || statusCode < 400 || statusCode > 599) {
        statusCode = 500;
    }

    const message = statusCode >= 500
        ? "Internal Server Error"
        : error.type === "entity.parse.failed"
            ? "Invalid JSON request body"
            : error.message || "Bad Request";

    logger.error({
        message: error.message || "Unknown server error",
        stack: error.stack,
        statusCode,
        method: req.method,
        url: req.originalUrl
    });

    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
};

export default errorMiddleware;
