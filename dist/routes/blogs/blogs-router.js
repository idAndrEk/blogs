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
exports.blogsRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../midlewares/auth/authMiddleware");
const blogs_service_1 = require("../../domain/blogs/blogs-service");
const blogsQueryRepository_1 = require("../../repositories/blogs/blogsQueryRepository");
const posts_service_1 = require("../../domain/posts/posts-service");
const postsQueryRepository_1 = require("../../repositories/posts/postsQueryRepository");
const input_validation_middleware_1 = require("../../midlewares/input-validation-middleware");
const blogValidation_1 = require("../../validators/blogValidation");
const queryParamsParser_1 = require("../../utils/queryParamsParser");
const PostBlogByIdValidation_1 = require("../../validators/PostBlogByIdValidation");
exports.blogsRouter = (0, express_1.Router)({});
// errors
const handleErrors = (res, error) => {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
};
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sortBy, sortDirection, parsedPageNumber, parsedPageSize } = (0, queryParamsParser_1.parseQueryParams)(req);
        const searchNameTerm = req.query.searchNameTerm || '';
        const blogsListResponse = yield blogsQueryRepository_1.BlogsQueryRepository.findBlog(+parsedPageNumber, +parsedPageSize, searchNameTerm.toString(), sortBy.toString(), sortDirection);
        return res.status(200).send(blogsListResponse);
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
exports.blogsRouter.get('/:id', input_validation_middleware_1.validateObjectIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let getBlogById = yield blogsQueryRepository_1.BlogsQueryRepository.findBlogById(req.params.id);
        if (getBlogById) {
            return res.send(getBlogById);
        }
        return res.sendStatus(404);
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
exports.blogsRouter.post('/', authMiddleware_1.authBasicMiddleware, blogValidation_1.BlogValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, websiteUrl } = req.body;
        const newBlog = yield blogs_service_1.blogsService.createBlog({ name, description, websiteUrl });
        return res.status(201).send(newBlog);
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
exports.blogsRouter.put('/:id', input_validation_middleware_1.validateObjectIdMiddleware, authMiddleware_1.authBasicMiddleware, blogValidation_1.BlogValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, websiteUrl } = req.body;
        const updateBlogById = yield blogs_service_1.blogsService.updateBlog(req.params.id, { name, description, websiteUrl });
        if (updateBlogById) {
            const blog = yield blogsQueryRepository_1.BlogsQueryRepository.findBlogById(req.params.id);
            return res.status(204).send(blog);
        }
        return res.sendStatus(404);
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
exports.blogsRouter.delete('/:id', input_validation_middleware_1.validateObjectIdMiddleware, authMiddleware_1.authBasicMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteBlogById = yield blogs_service_1.blogsService.deleteBlog(req.params.id);
        if (deleteBlogById) {
            return res.sendStatus(204);
        }
        return res.sendStatus(404);
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
//posts
exports.blogsRouter.get('/:id/posts', input_validation_middleware_1.validateObjectIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sortBy, sortDirection, parsedPageNumber, parsedPageSize } = (0, queryParamsParser_1.parseQueryParams)(req);
        let blogById = yield blogsQueryRepository_1.BlogsQueryRepository.findBlogById(req.params.id);
        if (!blogById) {
            return res.sendStatus(404);
        }
        const postsByBlogId = yield postsQueryRepository_1.PostsQueryRepository.findPostBlogById(blogById.id, +parsedPageNumber, +parsedPageSize, sortBy.toString(), sortDirection);
        if (postsByBlogId) {
            return res.send(postsByBlogId);
        }
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
exports.blogsRouter.post('/:id/posts', input_validation_middleware_1.validateObjectIdMiddleware, authMiddleware_1.authBasicMiddleware, PostBlogByIdValidation_1.PostBlogByIdValidation, //???
// PostValidation, //???
input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, shortDescription, content } = req.body;
        const blogId = req.params.id;
        const blogById = yield blogsQueryRepository_1.BlogsQueryRepository.findBlogById(blogId);
        if (!blogById || !blogById.id) {
            return res.sendStatus(404);
        }
        const createPostBlogger = yield posts_service_1.postsService.createPost(blogById === null || blogById === void 0 ? void 0 : blogById.id, blogById === null || blogById === void 0 ? void 0 : blogById.name, {
            title,
            shortDescription,
            content,
            blogId
        });
        if (createPostBlogger) {
            res.status(201).send(createPostBlogger);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
