import { AuthenticatedRequest, authMiddleware } from "@/authenticate";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  await dbConnect();

 const authResponse = await authMiddleware(req as AuthenticatedRequest);
   if (authResponse) return authResponse;
 
   const userId = (req as AuthenticatedRequest).user._id;

  const {targetedUserId } = await req.json();

  try {
    if(!userId || !targetedUserId){
      return NextResponse.json({message:'UserId not found.'},{status:401})
    }
    
    await User.updateOne({_id:userId},{$pull:{following:targetedUserId}})
    await User.updateOne({_id:targetedUserId},{$pull:{followers:userId}})

    return NextResponse.json({message:'Unfollwed Successfully'},{status:201})


  } catch (error) {
    return NextResponse.json({message:error}, {status:401})
  }
}