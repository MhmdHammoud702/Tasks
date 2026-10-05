import fs from "fs";
import winston from "winston";
fs.mkdirSync("logs", { recursive: true });

const logFormat = winston.format.printf(({ timestamp, level, message, statusCode, method, url, stack }) => {
    const text = typeof message === "string" ? message : message?.message || JSON.stringify(message);
    return `${timestamp} | ${level.toUpperCase()} | ${statusCode || ""} | ${method || ""} ${url || ""} | ${text}${stack ? `\n${stack}` : ""}`;
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        }),
        new winston.transports.File({
            filename: "logs/combined.log"
        })
    ]
});

export default logger;