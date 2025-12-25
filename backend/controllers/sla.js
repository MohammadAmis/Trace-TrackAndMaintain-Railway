const Report = require('../models/Report');

// @desc    Get SLA compliance summary
// @route   GET /api/sla/summary
exports.getSLASummary = async (req, res) => {
    try {
        const totalResolved = await Report.countDocuments({ status: 'RESOLVED' });
        const breached = await Report.countDocuments({ status: 'RESOLVED', isSlaBreached: true });

        const complianceRate = totalResolved > 0
            ? (((totalResolved - breached) / totalResolved) * 100).toFixed(1)
            : 100;

        // Get count of critical issues currently past deadline
        const criticalEscalations = await Report.countDocuments({
            status: { $ne: 'RESOLVED' },
            severity: 'CRITICAL',
            slaDeadline: { $lt: new Date() }
        });

        res.status(200).json({
            success: true,
            data: {
                overallCompliance: parseFloat(complianceRate),
                criticalEscalations,
                totalTickets: await Report.countDocuments()
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get active escalations
// @route   GET /api/sla/escalations
exports.getEscalations = async (req, res) => {
    try {
        const escalations = await Report.find({
            status: { $ne: 'RESOLVED' },
            $or: [
                { slaDeadline: { $lt: new Date() } }, // Already breached
                {
                    severity: 'CRITICAL',
                    slaDeadline: { $lt: new Date(Date.now() + 2 * 60 * 60 * 1000) } // Critical and < 2h left
                }
            ]
        })
            .populate('train coach component assignedTo')
            .sort({ slaDeadline: 1 });

        res.status(200).json({
            success: true,
            count: escalations.length,
            data: escalations
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
