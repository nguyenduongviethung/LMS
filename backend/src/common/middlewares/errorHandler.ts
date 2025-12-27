import { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    if (err instanceof Error) {
        console.error(err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }

    // fallback rất hiếm khi xảy ra
    return res.status(500).json({
        error: "Unknown error"
    });
}
