const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {

    let error = { ...err }
    console.log(error)
    error.message = err.message

    // Log to console for dev
    console.log(err.stack.red)

    // Mongoose bad ObjectID 
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    //Mongoose duplicated key
    if (err.code === 11000) {
        const message = `Duplicated field value entered`
        error = new ErrorResponse(message, 404)
    }

    // Mongose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 404)
    }


    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    })
}

module.exports = errorHandler