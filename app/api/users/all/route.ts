import dbConnect from "@/lib/dbConnect";
import Post from "@/models/postSchema";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

 
 try {
   const users = await User.find(
  );
   if(!users) {
     return NextResponse.json({ success: false, message: "No users found" });
   }
   const allPosts = (await Post.find()).reverse();
   
   return NextResponse.json({ success: true, users , allPosts });
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
 } catch (error:any) {
    console.log("Error in getting users", error.message);
    return NextResponse.json({ success: false, message: error.message });
 }
}