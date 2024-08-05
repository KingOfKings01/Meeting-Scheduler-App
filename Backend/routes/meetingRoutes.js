const express = require('express');
const meetingController = require('../controller/meetingController');

const router = express.Router();

router.get('/meetings', meetingController.getMeetings);

module.exports = router;
