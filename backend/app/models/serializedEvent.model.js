const db = require(".");

module.exports = (sequelize, Sequelize) => {
    const SerializedEvent = sequelize.define("serializedEvent", {
      menge:{
          type: Sequelize.DOUBLE
      },
      zeitstampel:{
          type: Sequelize.DATE
      }
    },{timestamps: false});
    
    SerializedEvent.removeAttribute('id');

      
    return SerializedEvent;
  };