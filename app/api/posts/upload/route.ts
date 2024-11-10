import dbConnect from "@/lib/dbConnect";
import { authMiddleware , AuthenticatedRequest } from "@/authenticate";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/postSchema";

export async function POST(req: NextRequest) {
  await dbConnect();

  // Check authentication and set user in the request
  const authResponse = await authMiddleware(req as AuthenticatedRequest);
  if (authResponse) return authResponse;

  const userId = (req as AuthenticatedRequest).user._id;
  const {username , fullname} = (req as AuthenticatedRequest).user

  try {
    const { caption, mediaURL } = await req.json();
    if (!caption || !mediaURL) {
      return NextResponse.json({ success: false, message: "Caption and video are required" }, { status: 400 });
    }

    // Create a new post with the authenticated user's ID
    const newPost = new Post({
      userId,
      username,
      fullname,
      caption,
      mediaURL
    });

    // Save the new post to MongoDB
    await newPost.save();
    console.log(newPost , username , fullname , userId)  

    // Respond with the newly created post details
    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating post:", error);

    return NextResponse.json({
      success: false,
      message: "Error while creating post",
      error: error.message,
    });
  }
}
