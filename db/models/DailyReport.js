import mongoose from "mongoose";

const DailyReportSchema = new mongoose.Schema(
    {
        entryDate: {
            type: Date,
            default: Date.now
        },
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        totalRawWater: {
            type: Number
        },
        totalTreatedWater: {
            type: Number
        },
        highestLevelOfCanal: {
            type: Number
        },
        lowestLevelOfCanal: {
            type: Number
        },
        tds: {
            type: Number
        },
        solidAlumSulphateUsage: {
            type: Number
        },
        solidAlumSulphateStock: {
            type: Number
        },
        liquidAlumSulphateUsage: {
            type: Number
        },
        liquidAlumSulphateStock: {
            type: Number
        },
        alumSulphateDosage: {
            type: Number
        },
        chlorineDailyUsage: {
            type: Number
        },
        chlorineDosage: {
            type: Number
        },
        cylindersFilled: {
            type: Number
        },
        cylindersInService: {
            type: Number
        },
        cylindersEmpty: {
            type: Number
        },
        cylindersInFactory: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("DailyReport", DailyReportSchema);
