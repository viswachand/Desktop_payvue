import { Request } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

/**
 * Runs express-validator chains and throws RequestValidationError if invalid
 */
export const validateRequest = async (req: Request, chains: ValidationChain[]) => {
    await Promise.all(chains.map((chain) => chain.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }
};
