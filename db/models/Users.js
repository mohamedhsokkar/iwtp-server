import mongoose from "mongoose";

export const USER_ROLES = ["admin", "engineer", "operator", "chemist"];

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email :{
        type: String,
        required: false,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfCreation: {
        type: Date,
        default: Date.now
    },
    nationalID: {
        type: Number,
        required: false,
        unique: true
    },
    role: {
        type: String,
        enum: USER_ROLES,
        default: "operator",
        required: true
    }
});

export default mongoose.model("user", UserSchema)
