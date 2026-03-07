import mongoose from "mongoose";

const analyticsReportSchema = new mongoose.Schema({
    reportType: {
        type: String, // e.g., "eventParticipation", "categoryPopularity"
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed, // store aggregated JSON
        required: true
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Admin who generated the report
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    exportType: {
        type: String, // "CSV", "PDF", "Both"
        enum: ['CSV',"PDF"],
        default: "PDF"
    }
}, { timestamps: true });

const analyticsReportModel = mongoose.models.analytics || mongoose.model("analytics", analyticsReportSchema);

export default analyticsReportModel;