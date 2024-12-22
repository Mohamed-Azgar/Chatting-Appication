import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },

    username:{
        type: String,
        require: true,
        uniqe: true
    },

    password:{
        type: String,
        require: true,
        minlenght: 6
    },

    gender:{
        type: String,
        require: true,
        enum: ["male", "female"]

    },

    profilePic:{
        type:String,
        default: ""
    },
    //creatAt, updateAt => Member since <creatAt>

},
//createAt, updateAt
{timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User