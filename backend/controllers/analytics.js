const Report = require('../models/Report');
const { Train } = require('../models/Masters');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/stats
exports.getStats = async (req, res) => {
    try {
        let filters = {};
        if (req.user.role === 'Zonal Admin') {
            filters.zone = req.user.zone;
        } else if (req.user.role === 'Depot Officer') {
            filters.depot = req.user.depot;
        }

        const totalActiveTrains = await Train.countDocuments();
        const totalReports24h = await Report.countDocuments({
            ...filters,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });
        const criticalIssues = await Report.countDocuments({
            ...filters,
            severity: 'CRITICAL',
            status: { $ne: 'RESOLVED' }
        });

        // Mocking resolution time for now as we don't have resolved timestamp in schema yet
        // In a real app, this would be calculated from history
        const avgResolutionTime = '4.2h';

        res.status(200).json({
            success: true,
            data: {
                totalActiveTrains,
                totalReports24h,
                criticalIssues,
                avgResolutionTime
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get report distribution by zone
// @route   GET /api/analytics/zones
exports.getZoneDistribution = async (req, res) => {
    try {
        const stats = await Report.aggregate([
            {
                $group: {
                    _id: '$zone',
                    issues: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    name: '$_id',
                    issues: 1,
                    resolved: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get component failure frequencies
// @route   GET /api/analytics/components
exports.getComponentFrequencies = async (req, res) => {
    try {
        const stats = await Report.aggregate([
            {
                $lookup: {
                    from: 'components',
                    localField: 'component',
                    foreignField: '_id',
                    as: 'componentData'
                }
            },
            { $unwind: '$componentData' },
            {
                $group: {
                    _id: '$componentData.type',
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$count' },
                    data: { $push: { name: '$_id', val: '$count' } }
                }
            },
            { $unwind: '$data' },
            {
                $project: {
                    name: '$data.name',
                    val: { $multiply: [{ $divide: ['$data.val', '$total'] }, 100] },
                    _id: 0
                }
            },
            { $sort: { val: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get resolution trends
// @route   GET /api/analytics/trends
exports.getTrends = async (req, res) => {
    try {
        const stats = await Report.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    name: '$_id',
                    v: '$count',
                    _id: 0
                }
            }
        ]);

        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
