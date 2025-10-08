import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {

    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({
            success: false,
            message: err.message,
            errors: err.serializeErrors(),
        });
    }

    res.status(400).send({
        success: false,
        message: err.message || "Something went wrong",
        errors: [{ message: err.message || "Unexpected error" }],
    });
};
