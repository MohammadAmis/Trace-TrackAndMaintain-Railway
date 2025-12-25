const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Base allowed origins from ENV
        let allowedOrigins = process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
            : [];

        // Always allow localhost in development
        if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
            if (!allowedOrigins.includes('http://localhost:5173')) {
                allowedOrigins.push('http://localhost:5173');
            }
        }

        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            console.error(`CORS Error: Origin ${origin} not allowed. Allowed: ${allowedOrigins.join(', ')}`);
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
};
app.use(cors(corsOptions));

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/masters', require('./routes/masters'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/users', require('./routes/users'));
app.use('/api/inspections', require('./routes/inspections'));
app.use('/api/sla', require('./routes/sla'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
