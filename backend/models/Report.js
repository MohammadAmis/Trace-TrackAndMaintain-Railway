const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reportId: { type: String, required: true, unique: true },
    train: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', required: true },
    component: { type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: true },
    severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        required: true
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'OPEN'
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    findings: String,
    resolutionEvidence: [String],
    acknowledgedAt: Date,
    resolvedAt: Date,
    slaDeadline: Date,
    isSlaBreached: { type: Boolean, default: false },
    history: [{
        action: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
    }],
    zone: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
