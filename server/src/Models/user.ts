import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique:true,
            trim: true
        },
        password:{
            type:String,
            required:true
        }
    },{
        timestamps:true
    }
)

const User = mongoose.model<IUser>("User" , userSchema)
export default User;