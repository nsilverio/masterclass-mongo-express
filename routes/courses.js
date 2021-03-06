const express = require('express')

const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')

// when more than 1 url param is possible to the same route, mergeParams must to be set to true
const router = express.Router({ mergeParams: true })

// Advanced results 
const Course = require('../models/Course')

// add protection to routes where user needs to be authorized
const { protect, authorize } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResults')

router
    .route('/')
    .get(advancedResults(Course,
        {
            path: 'bootcamp',
            select: 'name description'
        }), getCourses)
    .post(protect, authorize('publisher', 'admin'), createCourse)

router
    .route('/:id')
    .get(getCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse)


module.exports = router