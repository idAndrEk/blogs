"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = void 0;
const express_validator_1 = require("express-validator");
exports.CommentValidation = [
    (0, express_validator_1.body)('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ max: 300, min: 20 }) //30
        .withMessage('incorrect content'),
];
