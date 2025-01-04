import { AuthenticatedRequest, authMiddleware } from "@/authenticate";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const authResponse = await authMiddleware(req as AuthenticatedRequest);
  if (authResponse) return authResponse;

  const userId = (req as AuthenticatedRequest).user._id;
  try {
    const { targetedUserId } = await req.json();

    if (!userId || !targetedUserId) {
      return NextResponse.json(
        { message: "UserId and targeted userId not proviede" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetedUserId);

    if (!user || !targetUser) {
      return NextResponse.json(
        {
          message: "user not found",
        },
        {
          status: 401,
        }
      );
    }

    if (!Array.isArray(user.following)) user.following = [];
    if (!Array.isArray(targetUser.followers)) targetUser.followers = [];

    if (!user.following.includes(targetedUserId)) {
      user.following.push(targetedUserId);
    }
    if (!targetUser.followers.includes(userId)) {
      targetUser.followers.push(userId);
    }

    await user.save();
    await targetUser.save();

    return NextResponse.json(
      { message: "Followed Successfully." },
      { status: 201 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
