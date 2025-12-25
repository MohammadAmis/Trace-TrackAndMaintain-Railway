const Inspection = require('../models/Inspection');

exports.getInspections = async (req, res) => {
    try {
        const inspections = await Inspection.find().sort({ date: -1 });
        res.status(200).json({
            success: true,
            data: inspections
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.createInspection = async (req, res) => {
    try {
        const inspection = await Inspection.create(req.body);
        res.status(201).json({
            success: true,
            data: inspection
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
