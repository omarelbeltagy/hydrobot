module.exports = app => {
    const events = require("../controllers/event.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Event
    router.post("/", events.simulate);
  
    // Retrieve all Events
    router.get("/", events.findAll);
  
    app.use('/api/events', router);
  };