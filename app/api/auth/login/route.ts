import dbConnect from "@/lib/dbConnect";
import User from "@/models/userSchema";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(requset: Request) {
  await dbConnect();
  try {
    const { username, password } = await requset.json();

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user!.password);
    if (!user || !isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return NextResponse.json({ 
      success: true,
      user,
      token });
  } catch (error: any) {
    console.log("Error in logging in User", error.message);
    return NextResponse.json({
      success: false,
      message: "Error logging in user",
    });
  }
}
