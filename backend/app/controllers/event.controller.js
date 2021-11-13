const db = require("../models");
const Event = db.event;
const Op = db.Sequelize.Op;

// exports.simulate = (req,res) => { //Request validation
//   if(!(Object.keys(req.body).length==1)){
//     res.status(500).send({
//       message: "Day input not recieved."
//     });
//   }

// }

// Retrieve all Events from the database.
exports.findAll = (req, res) => {
  const deviceID = req.query.deviceID;
  var condition = deviceID ? { deviceID: { [Op.like]: `%${deviceID}%` } } : null;

  Event.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving events."
      });
    });
  
};