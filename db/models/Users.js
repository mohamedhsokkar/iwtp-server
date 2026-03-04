import mongoose from "mongoose";

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
    }
});

export default mongoose.model("user", UserSchema)