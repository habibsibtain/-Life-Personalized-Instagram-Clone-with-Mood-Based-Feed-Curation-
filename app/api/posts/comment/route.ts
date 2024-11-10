import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/commentSchema";
import Post from "@/models/postSchema";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest){
  await dbConnect();

  try {
    const {userId , postId, comment } = await req.json();
    if(!userId || !postId || !comment) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const newComment = await new Comment({
      userId,
      comment,
      createdAt: Date.now()
    });  

    await newComment.save();

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true }
    ).populate({
      path: 'comments',
      populate: { path: 'userId', select: 'username fullname' },
    });
    if(!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    await post.save();
  
    console.log("From Backend",post)
    return NextResponse.json({ success: true, post });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    
    console.log("Error in adding comment to post", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    
  }
}