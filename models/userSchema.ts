import exp from "constants";
import mongoose, {Schema} from "mongoose";

interface User  {
  fullname:string,
  username:string,
  email:string,
  password:string,
  profilePic:string
}

const userSchema: Schema <User> = new Schema({
  fullname:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true,
    unique:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true
  }
})

const User = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User', userSchema))

export default User