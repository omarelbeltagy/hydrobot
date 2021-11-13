const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const { Op } = require("sequelize");
const Caregiver = db.caregiver;
const Patient = db.patient;
const Event = db.event;
const Notification = db.notification;
const app = express();
const { getAllStatuses, getStatus, getActualRate, getDay, getTime, getCareGiverID, checkAllzeros,
  checknzv, makeTrueRates, modifynzv, makeNotifications, makeMessage } = require("./app/services/statusCalculator.js");

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', async function(req,res){
  let username = req.body.username
  let password = req.body.password

  const user = await Caregiver.findOne({where:{
    username: username,
    password: password
  }
  })
  if(user){
    res.json(username)
  }
  else{
    res.json("0")
  }

});

app.post('/user', async function(req,res){
  const user = req.body
  const patients = await Patient.findAll().then(e=>{
    res.json(e);
  })


});

app.post('/status', async function(req, res){
  let day = req.body.day;
  let time = req.body.time;
  let t = parseInt(time.slice(0,2))
  let timesteps = ((t - 8)*2)+1;
  timesteps += time.slice(-2) == "30" ? 1 : 0;
  try {
    await getAllStatuses(day,timesteps).then(async () => {
      res.send("r1");
    })
  
  }
  catch(e){
    res.send("Fehler bei der Berechnung der Status");
  }
});

app.get('/patient/:id', async function(req,res){
  const id = req.params.id;
  const events = await Event.findAll({attributes:['menge','zeitstampel'],
  where:{
    patientDeviceID: id,
    zeitstampel:{
      [Op.gte]:'2021-07-26'
    }
  }}).then(e=>res.json(e));
  

})

app.post('/notifs', async function (req, res){
  const user = req.body.user;
  var day = req.body.day;
  day = parseInt(day) < 10 ? "0"+ day : ""+day;
  const time = req.body.time;
  await Notification.findAll({attributes:['content'],
where:{
    caregiverID : user,
    zeitstampel: {
      [Op.startsWith]: '2021-07-'+day,
      [Op.gte] : '2021-07-'+day+' '+time
    }
}}).then(e => {
  res.json(e);
})
});

db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to hydrobot." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


