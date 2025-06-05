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
exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = exports.client = void 0;
exports.runDb = runDb;
const mongodb_1 = require("mongodb");
require('dotenv').config();
const mongoUri = process.env.MONGO_URL || 'mongodb://mongo:27017/ItBlogDb';
exports.client = new mongodb_1.MongoClient(mongoUri);
exports.blogsCollection = null;
exports.postsCollection = null;
exports.usersCollection = null;
exports.commentsCollection = null;
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
            yield exports.client.db('ItBlogDb').command({ ping: 1 });
            console.log('Connected successfully to MongoDB');
            const db = exports.client.db('ItBlogDb');
            exports.blogsCollection = db.collection('blogs');
            exports.postsCollection = db.collection('posts');
            exports.usersCollection = db.collection('users');
            exports.commentsCollection = db.collection('comments');
        }
        catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            yield exports.client.close();
            process.exit(1);
        }
    });
}
