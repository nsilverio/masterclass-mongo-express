const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileUpload');
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const path = require('path')

// Load env vars 
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

// Initialize express instance
const app = express();

// Body parse
app.use(express.json())

// Logs to console on dev env
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File upload 
app.use(fileUpload())
// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);


// error hadler
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1))
})


