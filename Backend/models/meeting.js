const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meeting = sequelize.define('Meeting', {
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availableSlots: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
  }
});

module.exports = Meeting;
