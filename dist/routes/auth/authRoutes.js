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
exports.authRouter = void 0;
const express_1 = require("express");
const usersQueryRepository_1 = require("../../repositories/users/usersQueryRepository");
const jwt_service_1 = require("../../application/jwt-service");
const authMiddleware_1 = require("../../midlewares/auth/authMiddleware");
exports.authRouter = (0, express_1.Router)({});
const bcrypt = require('bcrypt');
// errors
const handleErrors = (res, error) => {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
};
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginOrEmail, password } = req.body;
        const user = yield usersQueryRepository_1.UsersQueryRepository.findCheckUserByLogin(loginOrEmail);
        console.log(user);
        if (!user)
            return res.sendStatus(401);
        const isValidPassword = yield bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword)
            return res.sendStatus(401);
        const accessToken = yield jwt_service_1.jwtService.generateJwtToken(user.login, user.email);
        return res.status(200).json({ accessToken });
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
exports.authRouter.get('/me', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        return res.status(200).json({
            email: req.user.email,
            login: req.user.login,
            userId: req.user.id
        });
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
