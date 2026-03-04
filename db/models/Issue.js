const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    idNumber: {
        type: Number,
        required: true,
        unique: true
        
    },
    dateOfCreation: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("issue", IssueSchema)