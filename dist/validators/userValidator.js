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
exports.UserValidation = void 0;
const express_validator_1 = require("express-validator");
const usersQueryRepository_1 = require("../repositories/users/usersQueryRepository");
exports.UserValidation = [
    (0, express_validator_1.body)('login')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 3, max: 10 })
        .matches(/^[a-zA-Z0-9_-]*$/)
        .custom((login) => __awaiter(void 0, void 0, void 0, function* () {
        const userExists = yield usersQueryRepository_1.UsersQueryRepository.findUserByLogin(login);
        if (userExists) {
            throw new Error('incorrect login');
        }
        return true;
    })),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 6, max: 20 }),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .isEmail()
        .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
        const emailExists = yield usersQueryRepository_1.UsersQueryRepository.findUserByEmail(email);
        if (emailExists) {
            throw new Error('incorrect email');
        }
        return true;
    })),
];
