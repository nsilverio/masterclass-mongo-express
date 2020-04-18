
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const path = require('path')


// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)
})

// @desc    Get a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses')

    if (!bootcamp)
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

    res.status(200).json({ success: true, data: bootcamp })
})

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)

    // Corrected formated object ID that does not exist in the database
    if (!bootcamp)
        res.status(400).json({ success: false })

    res.status(201).json({
        success: true,
        data: bootcamp
    })

})
// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!bootcamp)
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

    res.status(200).json({ success: true, data: bootcamp })
})

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    /* in order to trigger the cascade delete of courses when a bootcamp is delete the 
        method findByIdAndDelete should be replaced by findById and them remove() 
    */
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp)
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

    bootcamp.remove();

    res.status(200).json({ success: true, data: {} })
})

// @desc    Upload photo for a bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp)
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

    if (!req.files)
        return next(new ErrorResponse(`Please upload a file`, 400))

    const file = req.files.file

    // make sure image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400))
    }
    // make sure image is  not lager than 1MB
    if (!file.filesize > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    // Create custom filename 
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    // Move file to path
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err)
            return next(new ErrorResponse(`Error uploading file`, 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
        res.status(200).json({ success: true, data: file.name })

    })
})

// @desc    Get bootcamps whithin a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    // Get latitude and longitude
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // Calculate radius using radians
    // Divide distance by radius of Earth
    // Earth radius = 3,963 mi / 6,378 km
    const radius = distance / 6378

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })
    res.status(200).json({
        success: true,
        counst: bootcamps.length,
        data: bootcamps
    })
})
