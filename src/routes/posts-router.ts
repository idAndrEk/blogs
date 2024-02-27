import {Request, Response, Router} from "express";
import validateObjectIdMiddleware, {inputValidationMiddleware} from "../midlewares/input-validation-middleware";
import {authBasicMiddleware} from "../midlewares/auth-middleware";
import {postsRepository} from "../repositories/posts-db-repository";
import {PostInputType, PostViewType} from "../types/PostType";
import {PostValidation} from "../midlewares/Post-validation";


export const postsRouter = Router({})

// Обработка ошибок
const handleErrors = (res: Response, error: any) => {
    console.error("Error:", error);
    res.status(500).json({error: "Internal Server Error"});
};

postsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const foundPosts: PostViewType[] = await postsRepository.findPost(req.query.title?.toString())
            res.status(200).send(foundPosts)
        } catch (error) {
            handleErrors(res, error);
        }
    })

postsRouter.get('/:id',
    validateObjectIdMiddleware,
    async (req: Request, res: Response) => {
        try {
            let post = await postsRepository.findPostById(req.params.id)
            if (post) {
                res.send(post)
                return
            }
            res.sendStatus(404)
            return
        } catch (error) {
            handleErrors(res, error);
        }
    })

postsRouter.post('/',
    authBasicMiddleware,
    PostValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {title, shortDescription, content, blogId} = req.body;

            const newPost: PostInputType | null = await postsRepository.createPost({
                title,
                shortDescription,
                content,
                blogId
            })
            if (!newPost) {
                const errors = [];
                errors.push({message: 'Error bloggerId', field: 'blogId'})
                if (errors.length) {
                    res.status(400).json({
                        errorsMessages: errors
                    })
                    return
                }
            }
            res.status(201).send(newPost)
            return;
        } catch (error) {
            handleErrors(res, error);
        }
    })

postsRouter.put('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    PostValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {title, shortDescription, content, blogId} = req.body;
            const postId = req.params.id;
            const isUpdated = await postsRepository.updatePost(postId, {
                title,
                shortDescription,
                content,
                blogId
            })

            const post = await postsRepository.findPostById(postId)

            if (isUpdated) {
                if (post) {
                    res.status(204).send(post);
                } else {
                    res.status(404).json({error: 'Post not found'});
                }
            } else {
                res.status(404).json({error: 'Post not found'});
            }
            const errors = [];
            errors.push({message: 'Error blogId', field: 'blogId'})

            if (errors.length) {
                res.status(400).json({
                    errorsMessages: errors
                });
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            handleErrors(res, error);
        }
    })

postsRouter.delete('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    async (req: Request, res: Response) => {
        try {
            const isDeleted = await postsRepository.deletePost(req.params.id)
            if (isDeleted) {
                res.sendStatus(204);
                return
            } else {
                res.status(404).json({error: 'Post not found'});
                return
            }
        } catch (error) {
            handleErrors(res, error);
        }
    })

