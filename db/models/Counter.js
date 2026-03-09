import mongoose from "mongoose";

const issueCounterSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

export const IssueCounter = mongoose.model("IssueCounter", issueCounterSchema);