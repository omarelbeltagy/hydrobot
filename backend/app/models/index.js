const dbConfig = require("../config/db.config.js");
const {getRDDA} = require("../services/rddaCalculator.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.event = require("./event.model.js")(sequelize, Sequelize);
db.patient = require("./patient.model.js")(sequelize, Sequelize);
db.notification = require("./notification.model.js")(sequelize, Sequelize);
db.serializedEvent = require("./serializedEvent.model.js")(sequelize,Sequelize);
db.caregiver = require("./caregiver.model.js")(sequelize,Sequelize);


db.patient.hasMany(db.event); // 1:M Patient/Events
db.event.belongsTo(db.patient);

db.patient.hasMany(db.serializedEvent); // 1:M Patient/SerializedEvents
db.serializedEvent.belongsTo(db.patient);


db.caregiver.hasMany(db.notification); //1:M Caregiver/Notificationss
db.notification.belongsTo(db.caregiver);







module.exports = db;