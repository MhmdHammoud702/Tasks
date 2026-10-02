import logger from "../config/logger.js";

const loggerMiddleware = (req, res, next) => {
    res.on("finish", () => {
        logger.info({
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode
        });
    });

    next();
};

export default loggerMiddleware;