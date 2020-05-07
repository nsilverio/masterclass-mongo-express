const express = require('express')

const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/reviews')

// when more than 1 url param is possible to the same route, mergeParams must to be set to true
const router = express.Router({ mergeParams: true })

// Advanced results 
const Review = require('../models/Review')

// add protection to routes where user needs to be authorized
const { protect, authorize } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResults')

router
    .route('/')
    .get(advancedResults(Review,
        {
            path: 'bootcamp',
            select: 'name description'
        }), getReviews)
    .post(protect, authorize('user', 'admin'), addReview)


router.route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview)

module.exports = router