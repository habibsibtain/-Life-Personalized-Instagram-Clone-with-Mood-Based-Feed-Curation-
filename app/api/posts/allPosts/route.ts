import { AuthenticatedRequest, authMiddleware } from "@/authenticate";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/postSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect();

    const authResponse = await authMiddleware(req as AuthenticatedRequest);
    if(authResponse) return authResponse;
    
    try {
      const posts = (await Post.find()).reverse();

      if (!posts) {
        return NextResponse.json({ success: false, message: "No posts found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, posts });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
     catch (error:any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 }); 
    }
}


export async function POST(req: NextRequest) {
  await dbConnect();

  const {postId , userId} = await req.json();

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    const hasLiked = (post.likedBy)!.includes(userId);
    if (hasLiked) {
      post.likedBy = (post.likedBy)!.filter((id) => id !== userId);
      (post.likes )! -= 1
    } else {
      (post.likedBy)!.push(userId);
      (post.likes)! += 1
    }

    await post.save();
    return NextResponse.json({ success: true, post });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    console.log("Error in liking post", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}