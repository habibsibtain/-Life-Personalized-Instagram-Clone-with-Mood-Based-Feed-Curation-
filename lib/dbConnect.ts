import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const dbConnect = async () => {
  const connectionState = mongoose.connection.readyState;
  if(connectionState === 1) {
    console.log("Already connected")
    return;
  }
  if(connectionState === 2) {
    console.log("Connecting...")
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI! ,{
      dbName:'LIFE',
      bufferCommands: true,
    } )
    console.log("Connected")
  } catch (error:any) {
    console.log("Error connecting to database" , error.message) 
    process.exit(1)
  }
}

export default dbConnect
