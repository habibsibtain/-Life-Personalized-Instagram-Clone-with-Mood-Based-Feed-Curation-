import mongoose, { Schema } from "mongoose";
import { commentDocument } from "./commentSchema";

interface Post extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  caption?: string;
  mediaURL: string;
  createdAt: Date;
  username?: string;
  fullname?: string;
  likes?:number
  likedBy?:string[]
  comments?: mongoose.Schema.Types.ObjectId[] | commentDocument[]
}

const postSchema: Schema<Post> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  mediaURL: {
    type: String,
    required: true,
  },
  likes:{
    type:Number,
    default:0
  },
  likedBy:{
    type:[String],
    default:[]
  },
 comments: {
   type: [mongoose.Schema.Types.ObjectId],
   ref: "Comment",
   default: [],
 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Post =
  (mongoose.models.Post as mongoose.Model<Post>) ||
  mongoose.model<Post>("Post", postSchema);

export default Post;
