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
const advancedResults = require('../middleware/advancedResults')

router
    .route('/')
    .get(advancedResults(Course,
        {
            path: 'bootcamp',
            select: 'name description'
        }), getCourses)
    .post(createCourse)

router
    .route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse)


module.exports = router