import dbConnect from "@/lib/dbConnect";
import Post from "@/models/postSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Accessing the route parameters from the request URL
    const postId = req.nextUrl.pathname.split("/").pop(); // Gets the postId from the URL
    
    if (!postId) {
      return NextResponse.json({ success: false, message: "Post ID not provided" }, { status: 400 });
    }

    const post = await Post.findById(postId)
      .populate({
        path: "comments",
        populate: {
          path: "userId",
        },
      });

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Error in getting comments", error);
    return NextResponse.json({ success: false, message: "Error in getting comments" }, { status: 500 });
  }
}
