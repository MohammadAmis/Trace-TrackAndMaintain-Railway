const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema({
    assetId: { type: String, required: true },
    inspector: { type: String, required: true },
    inspectorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    findings: { type: String, required: true },
    status: {
        type: String,
        enum: ['COMPLETED', 'PENDING_REPAIR', 'IN_PROGRESS'],
        default: 'COMPLETED'
    },
    type: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inspection', InspectionSchema);
