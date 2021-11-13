const db = require("../models");

module.exports = (sequelize, Sequelize) => {
    const Caregiver = sequelize.define("caregiver", {
        ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
        username:{
            type: Sequelize.STRING
          },
        password:{
            type: Sequelize.STRING
          }
        },{timestamps: false});
      
    return Caregiver;
  };