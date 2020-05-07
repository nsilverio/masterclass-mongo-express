
const Users = require('../models/User')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Users.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
})

// @desc    Get a single Users
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const Users = await Users.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if (!Users)
        return next(new ErrorResponse(`Users not found with id of ${req.params.id}`, 404))

    res.status(200).json({ success: true, data: Users })
})

// @desc    Create Users
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId

    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if (!bootcamp)
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404))

    // Check if user is the bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} not authorized to add a Users to bootcamp ${bootcamp._id}`, 401))
    }
    const Users = await Users.create(req.body)

    res.status(200).json({ success: true, data: Users })
})


// @desc    Update Users
// @route   PUT /api/v1/courses/courseId
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let Users = await Users.findById(req.params.id)

    if (!Users) {
        return next(new ErrorResponse(`Users not found with id of ${req.params.id}`, 404))
    }
    // Check if user is the bootcamp owner
    if (Users.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} not update the Users ${Users._id}`, 401))
    }

    Users = await Users.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({ success: true, data: Users })
})


// @desc    Delete Users
// @route   DELETE /api/v1/courses/courseId
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const Users = await Users.findById(req.params.id)

    if (!Users)
        return next(new ErrorResponse(`Users not found with id of ${req.params.id}`, 404))


    await Users.remove()

    res.status(200).json({ success: true, data: {} })
})