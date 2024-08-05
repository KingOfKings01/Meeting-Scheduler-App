const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors')

const userRoutes = require('./routes/userRoutes');
const meetingRoutes = require('./routes/meetingRoutes');

const meeting = require('./models/meeting');
const user = require('./models/user');

const app = express();

app.use(cors())
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', meetingRoutes);

meeting.hasMany(user)
user.belongsTo(meeting, { constraints: true, onDelete: "CASCADE" })

// Sync and initialize database
const predefinedTimes = ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'];

async function initializeDatabase() {
  await sequelize.sync({force: false});
  const Meeting = require('./models/meeting');
  for (const time of predefinedTimes) {
    await Meeting.findOrCreate({
      where: { time },
      defaults: { availableSlots: 4 }
    });
  }
}

initializeDatabase();

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
