"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const express_validator_1 = require("express-validator");
const blogsQueryRepository_1 = require("../repositories/blogs/blogsQueryRepository");
exports.PostValidation = [
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
    //Отдельным вынести
    (0, express_validator_1.body)('blogId')
        .optional() //???
        .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
        const blogExists = yield blogsQueryRepository_1.BlogsQueryRepository.findBlogValidationById(blogId);
        if (!blogExists) {
            throw new Error('incorrect blogId');
        }
        return true;
    })),
];
