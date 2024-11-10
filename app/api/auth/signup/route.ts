import { runCors } from "@/lib/cors";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userSchema";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await runCors(request, "POST", () => {});
  await dbConnect();
  try {
    const { fullname, username, email, password } = await request.json();

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
    }else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        fullname,
        username,
        email,
        password: hashPassword,
      });
      await newUser.save();
      const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      )
      return Response.json(
        {
          success: true,
          message: "User registered successfully",
          newUser,
          token
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Error in registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
        
      },
      { status: 500 }
    );
  }
}
