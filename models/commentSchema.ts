import mongoose , {Schema}  from "mongoose";

export interface commentDocument extends mongoose.Document {
  comment: string;
  userId: mongoose.Schema.Types.ObjectId;
  // postId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const commentSchema: Schema<commentDocument> = new Schema({
  comment: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.models.Comment|| mongoose.model<commentDocument>("Comment", commentSchema);

export default Comment;