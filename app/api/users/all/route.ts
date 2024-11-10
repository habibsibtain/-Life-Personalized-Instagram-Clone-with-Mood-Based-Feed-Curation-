import { AuthenticatedRequest, authMiddleware } from "@/authenticate";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/postSchema";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  // const authResponse = await authMiddleware(req as AuthenticatedRequest);
  // if (authResponse) return authResponse;

  // const userId = (req as AuthenticatedRequest).user._id;
 try {
   const users = await User.find(
    // { _id: { $ne: userId } }
  );
   if(!users) {
     return NextResponse.json({ success: false, message: "No users found" });
   }
   const allPosts = (await Post.find()).reverse();
   
   return NextResponse.json({ success: true, users , allPosts });
 } catch (error:any) {
    console.log("Error in getting users", error.message);
    return NextResponse.json({ success: false, message: error.message });
 }
}