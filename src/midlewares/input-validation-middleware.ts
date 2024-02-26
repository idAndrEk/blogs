import {NextFunction, Request, Response} from "express";
import {validationResult, ValidationError, param} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errResult = errors.array().map((error: ValidationError & {
            param?: string,
            location?: string
        }) => ({
            message: error.msg,
            field: error.param || error.location || "unknown"
        }));
        res.status(400).json({codeResult: 1, messages: errResult});
    } else {
        next();
    }
};