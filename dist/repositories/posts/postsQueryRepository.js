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
exports.PostsQueryRepository = void 0;
const db_1 = require("../../db/db");
const mongodb_1 = require("mongodb");
const queryParamsParser_1 = require("../../utils/queryParamsParser");
exports.PostsQueryRepository = {
    findPost(page, pageSize, title, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (title) {
                filter.name = { $regex: title };
            }
            const skip = (page - 1) * pageSize;
            const total = yield db_1.postsCollection.countDocuments(filter);
            const totalPages = Math.ceil(total / pageSize);
            const sortQuery = {};
            if (sortBy) {
                sortQuery[sortBy] = sortDirection === queryParamsParser_1.SortDirection.Asc ? 1 : -1;
            }
            const filteredPosts = yield db_1.postsCollection
                .find(filter)
                .skip(skip)
                .sort(sortQuery)
                .limit(pageSize)
                .toArray();
            return {
                pagesCount: totalPages,
                page: page,
                pageSize: pageSize,
                totalCount: total,
                items: filteredPosts.map(post => ({
                    id: post._id.toString(),
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                })),
            };
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (post) {
                return {
                    id: post._id.toString(),
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                };
            }
            else {
                return null;
            }
        });
    },
    findPostBlogById(blogId, page, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (blogId) {
                filter.blogId = blogId;
            }
            const skip = (page - 1) * pageSize;
            const total = yield db_1.postsCollection.countDocuments(filter);
            const totalPages = Math.ceil(total / pageSize);
            const sortQuery = {};
            if (sortBy) {
                sortQuery[sortBy] = sortDirection === queryParamsParser_1.SortDirection.Asc ? 1 : -1;
            }
            const filteredPostsByBlogs = yield db_1.postsCollection
                .find(filter)
                .skip(skip)
                .sort(sortQuery)
                .limit(pageSize)
                .toArray();
            return {
                pagesCount: totalPages,
                page: page,
                pageSize: pageSize,
                totalCount: total,
                items: filteredPostsByBlogs.map(post => ({
                    id: post._id.toString(),
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                })),
            };
        });
    }
};
