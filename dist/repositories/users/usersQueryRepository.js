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
exports.UsersQueryRepository = void 0;
const db_1 = require("../../db/db");
const queryParamsParser_1 = require("../../utils/queryParamsParser");
exports.UsersQueryRepository = {
    findUsers(sortBy, sortDirection, page, pageSize, login, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            const orConditions = [];
            if (login) {
                orConditions.push({ login: { $regex: login, $options: 'i' } });
            }
            if (email) {
                orConditions.push({ email: { $regex: email, $options: 'i' } });
            }
            if (orConditions.length > 0) {
                filter.$or = orConditions;
            }
            // console.log('Filter:', filter);
            const skip = (page - 1) * pageSize;
            const total = yield db_1.usersCollection.countDocuments(filter);
            const totalPages = Math.ceil(total / pageSize);
            const sortQuery = {};
            if (sortBy) {
                sortQuery[sortBy] = sortDirection === queryParamsParser_1.SortDirection.Asc ? 1 : -1;
            }
            let filteredUsers = yield db_1.usersCollection.find(filter)
                .skip(skip)
                .sort(sortQuery)
                .limit(pageSize)
                .toArray();
            // console.log('filteredUsers: ',filteredUsers)
            return {
                pagesCount: totalPages,
                page: page,
                pageSize: pageSize,
                totalCount: total,
                items: filteredUsers.map(u => ({
                    id: u._id.toString(),
                    login: u.login,
                    email: u.email,
                    createdAt: u.createdAt,
                })),
            };
        });
    },
    findUserByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('findUserByLogin: ', login)
            const user = yield db_1.usersCollection.findOne({ login });
            console.log(user);
            return !!user;
        });
    },
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ email });
            return !!user;
        });
    },
    findCheckUserByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ login });
            if (!user)
                return null;
            return {
                login: user.login,
                email: user.email,
                passwordHash: user.password,
                id: user._id
            };
        });
    }
};
