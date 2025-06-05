"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostBlogByIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.PostBlogByIdValidation = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ max: 30, min: 1 }) //30
        .withMessage('incorrect title'),
    (0, express_validator_1.body)('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ max: 100, min: 1 }) //100
        .withMessage('incorrect shortDescription'),
    (0, express_validator_1.body)('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ max: 1000, min: 1 })
        .withMessage('incorrect content'),
];
