const Report = require('../models/Report');

const SLA_HOURS = {
    'CRITICAL': 4,
    'HIGH': 24,
    'MEDIUM': 72,
    'LOW': 168
};

// @desc    Get all reports
// @route   GET /api/reports
exports.getReports = async (req, res) => {
    let query;

    // Role based filtering
    if (req.user.role === 'Super Admin') {
        query = Report.find();
    } else if (req.user.role === 'Zonal Admin') {
        query = Report.find({ zone: req.user.zone });
    } else {
        // Other roles might only see reports assigned to them or their department
        query = Report.find({ department: req.user.department });
    }

    const reports = await query.populate('train coach component department assignedTo');
    res.status(200).json({ success: true, count: reports.length, data: reports });
};

// @desc    Create new report
// @route   POST /api/reports
exports.createReport = async (req, res) => {
    try {
        const { severity } = req.body;

        // Calculate SLA deadline
        const hours = SLA_HOURS[severity] || 72;
        const slaDeadline = new Date(Date.now() + hours * 60 * 60 * 1000);

        const report = await Report.create({
            ...req.body,
            slaDeadline,
            history: [{
                action: 'Report Created',
                user: req.user.id
            }]
        });

        res.status(201).json({ success: true, data: report });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update report status
// @route   PATCH /api/reports/:id/status
exports.updateStatus = async (req, res) => {
    let report = await Report.findById(req.params.id);

    if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = req.body.status;

    // Handle SLA tracking timestamps
    if (req.body.status === 'IN_PROGRESS' && !report.acknowledgedAt) {
        report.acknowledgedAt = Date.now();
    }

    if (req.body.status === 'RESOLVED') {
        report.resolvedAt = Date.now();
        // Check if SLA was breached
        if (report.resolvedAt > report.slaDeadline) {
            report.isSlaBreached = true;
        }
    }

    report.history.push({
        action: `Status updated to ${req.body.status}`,
        user: req.user.id
    });

    await report.save();

    res.status(200).json({ success: true, data: report });
};
