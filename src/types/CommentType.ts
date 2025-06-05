import { ObjectId } from "mongodb";

export type CommentListResponse = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewType[]
};

// Тип с полем `_id`
export type CommentMongoType = {
    _id: ObjectId
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    };
    createdAt: Date
};

// с полем `id`
export type CommentViewType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    };
    createdAt: Date
};

