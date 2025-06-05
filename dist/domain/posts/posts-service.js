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
exports.postsService = void 0;
const mongodb_1 = require("mongodb");
const posts_repository_1 = require("../../repositories/posts/posts-repository");
exports.postsService = {
    // async findPost(title: string | null | undefined): Promise<PostViewType[]> {
    //     return PostsQueryRepository.findPost(title)
    // },
    //
    // async findPostById(id: string): Promise<PostViewType | null> {
    //     return PostsQueryRepository.findPostById(id)
    // },
    createPost(id, blogName, postInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = Object.assign(Object.assign({ _id: new mongodb_1.ObjectId() }, postInput), { blogId: id, blogName: blogName, createdAt: new Date() });
            const createdNewPost = yield posts_repository_1.postsRepository.createPost(newPost);
            return createdNewPost;
        });
    },
    updatePost(id, blogName, inputUpdatePost) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.updatePost(id, blogName, inputUpdatePost);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.deletePost(id);
        });
    },
};
