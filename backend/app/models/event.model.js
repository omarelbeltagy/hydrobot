const db = require("../models");

module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("event", {
      menge:{
          type: Sequelize.DOUBLE
      },
      zeitstampel:{
          type: Sequelize.DATE
      }
    },{timestamps: false});
    
    Event.removeAttribute('id');

      
    return Event;
  };