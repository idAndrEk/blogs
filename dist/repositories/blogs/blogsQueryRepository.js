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
exports.BlogsQueryRepository = void 0;
const db_1 = require("../../db/db");
const mongodb_1 = require("mongodb");
const queryParamsParser_1 = require("../../utils/queryParamsParser");
exports.BlogsQueryRepository = {
    findBlog(page, pageSize, name, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (name) {
                filter.name = { $regex: name, $options: 'i' };
            }
            const skip = (page - 1) * pageSize;
            const total = yield db_1.blogsCollection.countDocuments(filter);
            const totalPages = Math.ceil(total / pageSize);
            const sortQuery = {};
            if (sortBy) {
                sortQuery[sortBy] = sortDirection === queryParamsParser_1.SortDirection.Asc ? 1 : -1;
            }
            let filteredBlogs = yield db_1.blogsCollection.find(filter)
                .skip(skip)
                .sort(sortQuery)
                .limit(pageSize)
                .toArray();
            return {
                pagesCount: totalPages,
                page: page,
                pageSize: pageSize,
                totalCount: total,
                items: filteredBlogs.map(b => ({
                    id: b._id.toString(),
                    name: b.name,
                    description: b.description,
                    websiteUrl: b.websiteUrl,
                    createdAt: b.createdAt,
                    isMembership: b.isMembership,
                })),
            };
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (blog) {
                return {
                    id: blog._id.toString(),
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: blog.createdAt,
                    isMembership: blog.isMembership,
                };
            }
            else {
                return null;
            }
        });
    },
    findBlogValidationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return !!blog;
        });
    },
};
