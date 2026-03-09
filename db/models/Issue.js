import mongoose from "mongoose";
import { IssueCounter } from "./Counter.js";

const IssueSchema = new mongoose.Schema({
    faultID: {
        type: String,
        unique: true

    },
    description: {
        type: String,
        required: true
    },
    dateOfOccurance: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    location: {
        type: String,
        enum: ["Mashroat", "CTE", "Bamag1", "Bamag2"],
        required: true
    },
    status: {
        type: String,
        enum: ["open", "in_progress", "closed"],
        default: "open",
        required: true
    },
    dateOfFix: {
        type: Date,
        required: function () {
            return this.status === "closed";
        }
    },
    dateOfCreation: {
        type: Date,
        default: Date.now
    }
});

IssueSchema.pre("save", async function () {
    if (!this.isNew) return;

    const currentYear = new Date().getFullYear();
    const counter = await IssueCounter.findOneAndUpdate(
        { year: currentYear },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    const paddedNumber = String(counter.seq).padStart(4, "0");
    this.faultID = `${currentYear}f${paddedNumber}`;
})

export default mongoose.model("issue", IssueSchema)
