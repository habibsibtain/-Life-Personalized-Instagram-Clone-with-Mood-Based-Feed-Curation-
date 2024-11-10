import { AuthenticatedRequest, authMiddleware } from "@/authenticate";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/postSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect()

  const authResponse = await authMiddleware(req as AuthenticatedRequest)
  if(authResponse) return authResponse

  const userId = (req as AuthenticatedRequest).user._id
  try {
    const posts = (await Post.find({ userId: userId })).reverse();

    if(!posts) {
      return NextResponse.json({ success: false, message: "No posts found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, posts })
  } catch (error:any) {

    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    
  }
}