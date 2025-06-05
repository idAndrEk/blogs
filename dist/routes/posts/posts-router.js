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
exports.postsRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../midlewares/auth/authMiddleware");
const blogsQueryRepository_1 = require("../../repositories/blogs/blogsQueryRepository");
const posts_service_1 = require("../../domain/posts/posts-service");
const postsQueryRepository_1 = require("../../repositories/posts/postsQueryRepository");
const input_validation_middleware_1 = require("../../midlewares/input-validation-middleware");
const postValidation_1 = require("../../validators/postValidation");
const queryParamsParser_1 = require("../../utils/queryParamsParser");
exports.postsRouter = (0, express_1.Router)({});
// Обработка ошибок
const handleErrors = (res, error) => {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
};
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { sortBy, sortDirection, parsedPageNumber, parsedPageSize } = (0, queryParamsParser_1.parseQueryParams)(req);
        const queryTitle = (_a = req.query.title) === null || _a === void 0 ? void 0 : _a.toString();
        const foundPosts = yield postsQueryRepository_1.PostsQueryRepository.findPost(+parsedPageNumber, +parsedPageSize, queryTitle, sortBy.toString(), sortDirection);
        res.status(200).send(foundPosts);
    }
    catch (error) {
        handleErrors(res, error);
        return;
    }
}));
exports.postsRouter.get('/:id', input_validation_middleware_1.validateObjectIdMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let post = yield postsQueryRepository_1.PostsQueryRepository.findPostById(req.params.id);
        if (post) {
            res.status(200).send(post);
            return;
        }
        res.sendStatus(404);
        return;
    }
    catch (error) {
        handleErrors(res, error);
        return;
    }
}));
exports.postsRouter.post('/', authMiddleware_1.authBasicMiddleware, postValidation_1.PostValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, shortDescription, content, blogId } = req.body;
        const errors = [];
        const blogById = yield blogsQueryRepository_1.BlogsQueryRepository.findBlogById(blogId);
        if (!blogById || !blogById.id) {
            // errors.push({message: 'incorrect blogId', field: 'blogId'})
            errors.push({ message: 'Error blogId', field: 'blogId' });
        }
        if (errors.length > 0) {
            return res.status(400).json({ errorsMessages: errors });
        }
        const newPost = yield posts_service_1.postsService.createPost(blogById === null || blogById === void 0 ? void 0 : blogById.id, blogById === null || blogById === void 0 ? void 0 : blogById.name, {
            title, shortDescription, content, blogId
        });
        if (newPost) {
            return res.status(201).send(newPost);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (error) {
        handleErrors(res, error);
        return;
    }
}));
exports.postsRouter.put('/:id', input_validation_middleware_1.validateObjectIdMiddleware, authMiddleware_1.authBasicMiddleware, postValidation_1.PostValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const post = yield postsQueryRepository_1.PostsQueryRepository.findPostById(postId);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        const { title, shortDescription, content, blogId } = req.body;
        const blogById = yield blogsQueryRepository_1.BlogsQueryRepository.findBlogById(blogId);
        if (blogById) {
            const isUpdated = yield posts_service_1.postsService.updatePost(postId, blogById === null || blogById === void 0 ? void 0 : blogById.name, {
                title,
                shortDescription,
                content,
                blogId
            });
            if (isUpdated) {
                return res.sendStatus(204);
            }
            return res.sendStatus(404);
        }
    }
    catch (error) {
        return handleErrors(res, error);
    }
}));
exports.postsRouter.delete('/:id', input_validation_middleware_1.validateObjectIdMiddleware, authMiddleware_1.authBasicMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDeleted = yield posts_service_1.postsService.deletePost(req.params.id);
        if (isDeleted) {
            return res.sendStatus(204);
        }
        return res.status(404).json({ error: 'Post not found' });
    }
    catch (error) {
        handleErrors(res, error);
        return;
    }
}));
//comments
// postsRouter.post('/:id/comments',
//     CommentValidation,
//     async (req: Request, res: Response) => {
//         try {
//             const content = req.body
//             const postId = req.params.id
//             const postById = PostsQueryRepository.findPostById(postId)
//             if (!postById) {
//                 return res.sendStatus(404)
//             }
//             const newComment = await commentsService.createComments(postId, content)
//             if (newComment) {
//                 return res.status(201).send(newComment);
//             }
//             return res.sendStatus(404);
//         } catch (error) {
//             return handleErrors(res, error);
//         }
//     })
