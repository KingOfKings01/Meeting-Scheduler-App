const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

// Route to book a meeting
router.post('/book', userController.bookMeeting);

// Route to cancel a meeting
router.post('/cancel/:userId', userController.cancelMeeting);

// Route to get all users
router.get('/all', userController.getAllUsers);

module.exports = router;
