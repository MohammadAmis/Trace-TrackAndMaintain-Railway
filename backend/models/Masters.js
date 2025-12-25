const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
    trainId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, default: 'Express' },
    zone: String,
    division: String,
    coaches: { type: Number, default: 0 },
    status: { type: String, default: 'Active' }
});

const CoachSchema = new mongoose.Schema({
    coachId: { type: String, required: true, unique: true },
    trainRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
    trainId: String, // Denormalized for easier querying
    type: String,
    position: Number,
    components: { type: Number, default: 0 },
    status: { type: String, default: 'Active' }
});

const ComponentSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    department: { type: String, required: true },
    coachRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
    coachId: String, // Denormalized
    status: { type: String, default: 'Healthy' }
});

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true }
});

module.exports = {
    Train: mongoose.model('Train', TrainSchema),
    Coach: mongoose.model('Coach', CoachSchema),
    Component: mongoose.model('Component', ComponentSchema),
    Department: mongoose.model('Department', DepartmentSchema)
};
