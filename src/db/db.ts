import { MongoClient, Collection } from 'mongodb';
import { BlogViewType } from '../types/BlogType';
import { PostViewType } from '../types/PostType';
import { UserViewType } from '../types/UserType';
import { CommentViewType } from '../types/CommentType';

require('dotenv').config();

const mongoUri = process.env.MONGO_URL || 'mongodb://mongo:27017/ItBlogDb';
export const client = new MongoClient(mongoUri);

export let blogsCollection: Collection<BlogViewType> = null!;
export let postsCollection: Collection<PostViewType> = null!;
export let usersCollection: Collection<UserViewType> = null!;
export let commentsCollection: Collection<CommentViewType> = null!;

export async function runDb() {
  try {
    await client.connect();
    await client.db('ItBlogDb').command({ ping: 1 });
    console.log('Connected successfully to MongoDB');

    const db = client.db('ItBlogDb');
    blogsCollection = db.collection<BlogViewType>('blogs');
    postsCollection = db.collection<PostViewType>('posts');
    usersCollection = db.collection<UserViewType>('users');
    commentsCollection = db.collection<CommentViewType>('comments');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    await client.close();
    process.exit(1);
  }
}
