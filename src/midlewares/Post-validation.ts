import {body} from "express-validator";
import {BlogsQueryRepository} from "../repositories/blogs/blogsQueryRepository";

export const PostValidation = [
    body('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 30, min: 1}) //30
        .withMessage('incorrect title'),
    body('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 100, min: 1})//100
        .withMessage('incorrect shortDescription'),
    body('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 1000, min: 1})
        .withMessage('incorrect content'),
    body('blogId')
        .custom(async (blogId, { req }) => {
            const blogById = await BlogsQueryRepository.findBlogValidationById(blogId);
            if (!blogById) {
                throw new Error('incorrect blogId');
            }
        })
        .withMessage('incorrect blogId')

    // body('blogId')
    //     .custom(async (_, { req }) => { //игнорируем значение blogId из тела запроса
    //         const blogId = req.params?.id
    //         const blogById = await BlogsQueryRepository.findBlogValidationById(blogId);
    //         if (!blogById) {
    //             throw new Error('incorrect blogId');
    //         }
    //     }),
]