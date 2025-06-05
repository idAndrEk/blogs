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
exports.usersRouter = void 0;
const express_1 = require("express");
const usersQueryRepository_1 = require("../../repositories/users/usersQueryRepository");
const queryParamsParser_1 = require("../../utils/queryParamsParser");
const authMiddleware_1 = require("../../midlewares/auth/authMiddleware");
const userService_1 = require("../../domain/users/userService");
const userValidator_1 = require("../../validators/userValidator");
const input_validation_middleware_1 = require("../../midlewares/input-validation-middleware");
exports.usersRouter = (0, express_1.Router)({});
// errors
const handleErrors = (res, error) => {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
};
exports.usersRouter.get('/', authMiddleware_1.authBasicMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const sortBy: SortBy = req.query.sortBy as SortBy || SortBy.CreatedAt;
        // const sortDirection: SortDirection = req.query.sortDirection === 'asc' ? SortDirection.Asc : SortDirection.Desc;
        // const parsedPageNumber = req.query.pageNumber || 1;
        // const parsedPageSize = req.query.pageSize || 10;
        const { sortBy, sortDirection, parsedPageNumber, parsedPageSize } = (0, queryParamsParser_1.parseQueryParams)(req);
        // console.log(parseQueryParams(req))
        const searchLoginTerm = req.query.searchLoginTerm || '';
        const searchEmailTerm = req.query.searchEmailTerm || '';
        const usersListResponse = yield usersQueryRepository_1.UsersQueryRepository.findUsers(sortBy.toString(), sortDirection, +parsedPageNumber, +parsedPageSize, searchLoginTerm.toString(), searchEmailTerm.toString());
        return res.status(200).send(usersListResponse);
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
exports.usersRouter.post('/', authMiddleware_1.authBasicMiddleware, userValidator_1.UserValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { login, password, email } = req.body;
        const newUser = yield userService_1.usersService.createUser({ login, password, email });
        return res.status(201).send(newUser);
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
exports.usersRouter.delete('/:id', input_validation_middleware_1.validateObjectIdMiddleware, authMiddleware_1.authBasicMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteUserById = yield userService_1.usersService.deleteUser(req.params.id);
        if (deleteUserById) {
            return res.sendStatus(204);
        }
        return res.sendStatus(404);
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
