const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { Train, Coach, Component, Department } = require('./models/Masters');
const Report = require('./models/Report');
const Inspection = require('./models/Inspection');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Train.deleteMany();
        await Coach.deleteMany();
        await Component.deleteMany();
        await Department.deleteMany();
        await Report.deleteMany();
        await Inspection.deleteMany();

        console.log('Clearing old data...');

        // 1. Create Departments
        const depts = await Department.create([
            { name: 'Mechanical', code: 'MECH' },
            { name: 'Electrical', code: 'ELEC' },
            { name: 'S&T', code: 'S&T' }
        ]);

        // 2. Create Users
        const users = await User.create([
            { name: 'Amit Kumar', email: 'amit.hq@railways.gov.in', password: 'password123', role: 'Super Admin', zone: 'HQ', division: 'HQ' },
            { name: 'Sanjay Singh', email: 'sanjay.nz@railways.gov.in', password: 'password123', role: 'Zonal Admin', zone: 'Northern', division: 'LKO' },
            { name: 'Rajesh Sharma', email: 'rajesh.mech@railways.gov.in', password: 'password123', role: 'Maintenance Engineer', zone: 'Northern', division: 'LKO' },
            { name: 'Priya Verma', email: 'priya.insp@railways.gov.in', password: 'password123', role: 'Inspector', zone: 'Western', division: 'BCT' },
            { name: 'Vikram Seth', email: 'vikram.do@railways.gov.in', password: 'password123', role: 'Depot Officer', zone: 'Northern', division: 'DLH' }
        ]);

        // 3. Create Trains
        const trains = await Train.create([
            { trainId: '12401', name: 'Nanda Devi Exp', type: 'Express', zone: 'Northern', division: 'Delhi', coaches: 22 },
            { trainId: '12001', name: 'Shatabdi Exp', type: 'Express', zone: 'Northern', division: 'Delhi', coaches: 18 },
            { trainId: '12951', name: 'Rajdhani Exp', type: 'Express', zone: 'Western', division: 'Mumbai', coaches: 20 },
            { trainId: '22436', name: 'Vande Bharat Exp', type: 'High Speed', zone: 'Northern', division: 'Delhi', coaches: 16 }
        ]);

        // 4. Create Coaches for Nanda Devi
        const coaches = await Coach.create([
            { coachId: 'B1', trainRef: trains[0]._id, trainId: '12401', type: '3AC', position: 1, components: 45 },
            { coachId: 'B2', trainRef: trains[0]._id, trainId: '12401', type: '3AC', position: 2, components: 42, status: 'In Repair' },
            { coachId: 'A1', trainRef: trains[1]._id, trainId: '12001', type: '2AC', position: 5, components: 38 }
        ]);

        // 5. Create Components
        const components = await Component.create([
            { uid: 'COMP-101', name: 'AC Unit', type: 'Electrical', department: 'Electrical', coachRef: coaches[0]._id, coachId: 'B1', status: 'Healthy' },
            { uid: 'COMP-102', name: 'Water Pump', type: 'Mechanical', department: 'Mechanical', coachRef: coaches[0]._id, coachId: 'B1', status: 'Warning' },
            { uid: 'COMP-204', name: 'Axle Box', type: 'Mechanical', department: 'Mechanical', coachRef: coaches[1]._id, coachId: 'B2', status: 'Healthy' }
        ]);

        // 6. Create Reports
        const now = new Date();
        await Report.create([
            {
                reportId: 'REP-001',
                train: trains[0]._id,
                coach: coaches[0]._id,
                component: components[0]._id,
                severity: 'HIGH',
                status: 'OPEN',
                department: depts[1]._id,
                findings: 'AC Failure in B1',
                slaDeadline: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24h from now
                createdAt: now
            },
            {
                reportId: 'REP-742',
                train: trains[1]._id,
                coach: coaches[2]._id,
                component: components[1]._id, // Note: seeded components are limited, this is fine for demo
                severity: 'CRITICAL',
                status: 'IN_PROGRESS',
                department: depts[0]._id,
                findings: 'Brake pressure drop in A1',
                acknowledgedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // Ack 1h ago
                slaDeadline: new Date(now.getTime() + 3 * 60 * 60 * 1000), // Due in 3h
                createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
            },
            {
                reportId: 'REP-999',
                train: trains[2]._id,
                coach: coaches[1]._id,
                component: components[2]._id,
                severity: 'CRITICAL',
                status: 'OPEN',
                department: depts[2]._id,
                findings: 'Communication failure in B2',
                slaDeadline: new Date(now.getTime() - 1 * 60 * 60 * 1000), // Breached 1h ago
                createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000)
            }
        ]);

        // 7. Create Inspections
        await Inspection.create([
            {
                assetId: 'COMP-101 (B1 AC Unit)',
                inspector: 'Rajesh Sharma',
                findings: 'Normal operation. Filter cleaned.',
                status: 'COMPLETED',
                type: 'Routine',
                date: new Date('2025-12-23T10:30:00')
            },
            {
                assetId: 'COMP-102 (B1 Water Pump)',
                inspector: 'Rajesh Sharma',
                findings: 'Slight leakage observed in primary valve.',
                status: 'PENDING_REPAIR',
                type: 'QR-triggered',
                date: new Date('2025-12-23T11:15:00')
            }
        ]);

        console.log('All Data successfully imported!');
        process.exit();
    } catch (err) {
        console.error('Error importing data:', err);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await User.deleteMany();
        await Train.deleteMany();
        await Coach.deleteMany();
        await Component.deleteMany();
        await Department.deleteMany();
        await Report.deleteMany();
        await Inspection.deleteMany();
        console.log('Data destroyed!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}
