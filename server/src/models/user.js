import mongoose from "mongoose";
import { Schema } from  "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        }
    }, {
    timestamps: true
}
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.gensalt(10)
    this.password = await bcrypt.hash(this.password , salt)
    next()
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password)
}

const User = mongoose.model("User", userSchema);
export default User;