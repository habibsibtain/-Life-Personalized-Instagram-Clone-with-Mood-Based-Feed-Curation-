import dbConnect from "@/lib/dbConnect";
import Post from "@/models/postSchema";
import { NextRequest, NextResponse } from "next/server";


export async function GET (req : NextRequest , { params }: { params: { postId: string } }) {

  await dbConnect()
  try {
    const { postId } = params
   const post = await Post.findById(postId).populate({
    path: "comments",
    populate: {
      path: "userId",
    },
   })
    console.log(post)
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Error in getting comments", error);
    return NextResponse.json({ success: false, message: "Error in getting comments" }, { status: 500 });
  }
}