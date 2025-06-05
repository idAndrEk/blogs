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
exports.authMiddleware = exports.authBasicMiddleware = void 0;
const jwt_service_1 = require("../../application/jwt-service");
const usersQueryRepository_1 = require("../../repositories/users/usersQueryRepository");
const authBasicMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const base64 = Buffer.from('admin:qwerty').toString('base64');
    const encode = `Basic ${base64}`;
    if (authHeader === encode) {
        next();
    }
    else {
        res.status(401).send('Access denied');
    }
};
exports.authBasicMiddleware = authBasicMiddleware;
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    console.log('token: ', token);
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    try {
        const decodedToken = yield jwt_service_1.jwtService.getUserByToken(token);
        console.log('decodedToken: ', decodedToken);
        // Если токен неверный или просрочен
        if (!decodedToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const user = yield usersQueryRepository_1.UsersQueryRepository.findCheckUserByLogin(decodedToken.login);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    return;
});
exports.authMiddleware = authMiddleware;
