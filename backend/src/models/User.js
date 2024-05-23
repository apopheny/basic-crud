const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  'postgres://myuser:mypassword@localhost:5432/mydatabase'
);

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
