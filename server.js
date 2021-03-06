const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileUpload = require('express-fileUpload')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

// Load env vars 
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

// Initialize express instance
const app = express();

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())


// Logs to console on dev env
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File upload 
app.use(fileUpload())
// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// sanitize data & prevent noSQL injection
app.use(mongoSanitize())

// set security headers
app.use(helmet())

// prevent XSS attacks
app.use(xss())

// Rate limitting
const limiter = rateLimit({
    windowsMs: 10 * 60 * 1000, // 10 min
    max: 100
})
app.use(limiter)

// prevent http param polution 
app.use(hpp())

// enable CORS
app.use(cors())


// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/auth/users', users)
app.use('/api/v1/reviews', reviews)


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


