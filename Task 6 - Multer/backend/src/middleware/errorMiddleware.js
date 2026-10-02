import logger from "../config/logger.js";

const errorMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    logger.error({
        message,
        statusCode,
        method: req.method,
        url: req.originalUrl
    });

    res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
};

export default errorMiddleware;
