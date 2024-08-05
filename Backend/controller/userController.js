const User = require("../models/user");
const Meeting = require("../models/meeting");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    console.log();
    console.log();
    console.log("DDDDDDDDDDDDDDDDDDDDDDDD:", await users[0].getMeeting());
    console.log();
    console.log();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Existing methods
exports.bookMeeting = async (req, res) => {
  const { name, email, time } = req.body;

  try {
    const meeting = await Meeting.findOne({ where: { time } });
    if (!meeting) {
      return res.status(404).json({ message: "Meeting time not found" });
    }

    if (meeting.availableSlots <= 0) {
      return res
        .status(400)
        .json({ message: "No slots available for this time" });
    }
    console.log();
    console.log();
    console.log("XXXXXXXXXXXXXXXXXXXXXX", meeting.id);
    console.log();
    console.log();
    const user = await User.create({
      name,
      email,
      meetId: meeting.id,
      meetingId: meeting.id,
    });
    await meeting.decrement("availableSlots", { by: 1 });

    res.json({ message: "Meeting booked successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelMeeting = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const meeting = await Meeting.findByPk(user.meetId);
    if (!meeting) {
      return res.status(400).json({ message: "User has no meeting to cancel" });
    }

    meeting.availableSlots += 1;
    await meeting.save();
    await user.destroy();

    res.json({ message: "Meeting canceled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
