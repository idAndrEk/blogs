"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = exports.validateObjectIdMiddleware = void 0;
const express_validator_1 = require("express-validator");
const validateObjectIdMiddleware = (req, res, next) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    const { id } = req.params;
    if (!objectIdPattern.test(id)) {
        res.sendStatus(400);
        return;
    }
    next();
};
exports.validateObjectIdMiddleware = validateObjectIdMiddleware;
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errorsMessages: errors.array({ onlyFirstError: true }).map((e) => ({
                message: e.msg,
                field: e.path
            }))
        });
    }
    return next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
