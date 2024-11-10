import { AuthenticatedRequest, authMiddleware } from "@/authenticate";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/postSchema";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  await dbConnect();

  const authResponse = await authMiddleware(req as AuthenticatedRequest);
  if(authResponse) return authResponse;

  const userId = (req as AuthenticatedRequest).user._id;

  try {
    const user = await User.findById(userId);
    if(!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const posts =( await Post.find({ userId: user._id })).reverse();
    return NextResponse.json({ success: true, user , posts });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    console.log("Error in getting single user", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    
  }
}