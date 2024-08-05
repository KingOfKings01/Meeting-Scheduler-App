const Meeting = require('../models/meeting');

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll();
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
