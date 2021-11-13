const db = require("../models");

module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notification", {
      zeitstampel: {
        type: Sequelize.DATE
      },
      content:{
          type: Sequelize.STRING(50)
      }
        },{timestamps: false});
    
    Notification.removeAttribute('id');

      
    return Notification;
  };