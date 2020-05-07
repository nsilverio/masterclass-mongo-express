const express = require('express')

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users')

// when more than 1 url param is possible to the same route, mergeParams must to be set to true
const router = express.Router({ mergeParams: true })

// Advanced results 
const User = require('../models/User')

// add protection to routes where user needs to be authorized
const { protect, authorize } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResults')

router.use(protect)
router.use(authorize('admin'))

router
    .route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)


module.exports = router