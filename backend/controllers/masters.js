const { Train, Coach, Component } = require('../models/Masters');

exports.getTrains = async (req, res) => {
    try {
        const trains = await Train.find();
        res.status(200).json({ success: true, count: trains.length, data: trains });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.createTrain = async (req, res) => {
    try {
        const train = await Train.create(req.body);
        res.status(201).json({ success: true, data: train });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find().populate('trainRef');
        res.status(200).json({ success: true, count: coaches.length, data: coaches });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getComponents = async (req, res) => {
    try {
        const components = await Component.find().populate('coachRef');
        res.status(200).json({ success: true, count: components.length, data: components });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
