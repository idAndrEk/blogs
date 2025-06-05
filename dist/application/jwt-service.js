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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_ACCESS_SECRET;
exports.jwtService = {
    generateJwtToken(login, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = { login, email };
            if (!secret) {
                throw new Error('JWT secret is not defined');
            }
            return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1h' });
        });
    },
    getUserByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!secret) {
                    throw new Error('JWT secret is not defined');
                }
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                return decoded; // возвращаем объект пользователя
            }
            catch (error) {
                return null;
            }
        });
    }
};
