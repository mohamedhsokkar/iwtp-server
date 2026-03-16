import mongoose from "mongoose";

export const USER_ROLES = ["admin", "engineer", "operator", "chemist"];

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    workID:{
        type: Number,
        required: true,
        unique: true
    },
    email :{
        type: String,
        required: false,
        unique: true,
        sparse: true
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
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: USER_ROLES,
        default: "operator",
        required: true
    }
});

export default mongoose.model("user", UserSchema)
