const axios  = require('axios');
const sequelize = require("sequelize");
const db = require("../models");
const SerializedEvent = db.serializedEvent;
const Patient = db.patient;
const Notification = db.notification;
const {Op} = require("sequelize");
const {performance} = require('perf_hooks');

let truth = [[1,[0,19.8,46.5,58.2]],[2,[71.6,61.1,54.1,58.8]],[3,[106.3,109.7,99.9,93.8]], //True rates for each patient assuming NO external factors like hot weather or vomiting
[4,[69.8,59.6,54.4,58.9]],[5,[38.0,39.3,57.2,72.4]],[6,[118.1,115.8,90.7,75.8]],[7,[147.8,150.6,115.5,96.7]],
[8,[67.0,57.2,52.7,54.1]],[9,[96.6,92.2,84.4,75.6]],[10,[0,21.7,58.0,79.9]],[11,[9.2,18.8,36.3,41.9]],[12,[68.3,56.3,51.8,55.1]],
[13,[58.4,62.3,42.1,42.2]],[14,[75.0,59.0,52.9,59.1]],[15,[0,20.6,51.4,69.2]],[16,[71.7,72.2,67.7,63.9]],
[17,[43.9,41.9,58.2,63.8]],[18,[11.8,24.3,43.1,50.7]],[19,[87.9,88.8,72.4,63.6]],[20,[83.0,65.2,60.2,65.2]]]

const assignments = {
    cg1: [1,2,3,4],
    cg2: [5,6,7,8],
    cg3: [9,10,11,12],
    cg4: [13,14,15,16],
    cg5: [17,18,19,20]
  }
  

exports.checknzv = (events) =>{ //Checking atleast two non zero values
    let nzCount = 0
    for(var i = 0; i < events.length; i++){
        if(events[i]!=0){
            nzCount++;
        }
        if(nzCount>1){
            return true;
        }
    }
    return false;
}

exports.modifynzv = (data) => {
    let index;
    if(data[0]!=0){
        data[data.length - 1] = 0.1;
        return data;
    }
    if(data[data.length - 1] != 0){
        data[0] = 0.1;
        return data;
    }
    for(var i = 0; i< data.length; i++){
        if(data[i]!=0){
            index = i;
        }
    }
    if(index<=data.length/2){
        data[data.length - 1] = 0.1;
        return data;
    }
    data[0] = 0.1;
    return data;
}

exports.checkAllzeros = (events) =>{
    for(var i = 0; i< events.length; i++){
        if (events[i]!=0){
            return false;
        }
    }
    return true;
}

exports.makeTrueRates = async (id) =>{
    let baseRates = truth[id-1][1];
    let temperature ;
    let additionalAmount = 0;
    await axios.get('https://api.openweathermap.org/data/2.5/weather?q=Munich&units=metric&appid=44962222a3e2b014741d7604cea6f0b9').then(res=>{
        temperature = res.data.main.temp;
    })
    if(temperature>20){
        additionalAmount+= (temperature-20)*50; //50 Mililiters for each degree celsius above 20.
    }
    await Patient.findAll({
        where:{
            deviceID: id
        }
    }).then(p =>{
        const lossFactor = p[0].dataValues.lossFactor; //Adjusting true rates to reflect loss factors
            additionalAmount += 500*lossFactor
            for(var i = 0; i< 4; i++){
                baseRates[i]+= additionalAmount/24;
            }
    })
    return baseRates;
    
}

    exports.getStatus = async (id, data) =>{
    let trueRates = await exports.makeTrueRates(id);
    // console.log("True Rate: " + trueRates[index]);

    let index = Math.floor((data.length-1)/6) > 3 ? 3 :  Math.floor((data.length-1)/6)
    let actualRate = await exports.getActualRate(data);
    let d;
    let s;
    let status;
    [d,s] = actualRate/trueRates[index] > 1? [(actualRate/trueRates[index] -1), 1] : [1 - actualRate/trueRates[index], -1]
    d*=100
    if(d>30){
        if(s>0){
            status = 'Overdrinking'
        }
        else if(s<0){
            status = 'Underdrinking'
        }
    }
    else{
        status = 'Normal'
    }
    if([5,6,7,8,11,12,13,14,17,18,19,20].includes(data.length) && status!='Normal'){
        status = "Possibly "+ status;
    }
    console.log("id: "+ id);
    console.log("Data: "+ data);
    console.log("Actual Rate: "+actualRate);
    // console.log("True Rate: " + trueRates[index]);
    console.log("Percentage Difference: "+ d);
    console.log("Status: "+ status);
    return status;
}

exports.getActualRate = async (data) =>{
    let actualRate;
    if(exports.checkAllzeros(data)){
        return 0;
    }
    if(!exports.checkAllzeros(data) && !exports.checknzv(data)){
        data = exports.modifynzv(data);
    }
    await axios.post('http://localhost:8000/status', {data: data}).then(res=>{
        actualRate = res.data;
    })
    console.log(actualRate);
    return actualRate;
} 


exports.getDay = async (day) => {
    day = day < 10 ? "0"+day : ""+ day;
    let arr = [];
    let temp = [];
    for(var i = 1; i<=20; i++){
        await SerializedEvent.findAll({
            where:{
                patientDeviceID: i,
                zeitstampel: {
                    [Op.startsWith]: '2021-07-'+day
                }

            }
        }).then( (entry) => {
            for(var j = 0; j< entry.length; j++){
            temp.push(entry[j].dataValues.menge)}

        })
        arr.push([i, temp]);
        temp = [];


    }
    // console.log(arr)
    return arr;

}

  exports.getAllStatuses = async (day, timesteps) => {
    let d = await exports.getDay(day);
    console.log("DAY FETCHED")
    console.log(d)
    let temp = [];
    let arr = [];
    for(var i = 1; i<=20; i++){
        await exports.getStatus(i,d[i-1][1].slice(0,timesteps)).then(res =>{
            console.log("RESULT")
            console.log(res)
            arr.push(res);
        })
    }
    for(var i = 1; i<= arr.length; i++){
        await Patient.update({status: arr[i-1]}, {
          where: {
            deviceID: i
          }
        });
      }
}

exports.makeNotifications =  async (day, timesteps) => {
    let d = await exports.getDay(day);
    let temp = [];
    let arr = [];
    for(var i = 1; i<=20; i++){
        for(var j = 4; j<= timesteps; j++){
            await exports.getStatus(i,d[i-1][1].slice(0,j)).then(res =>{
                temp.push(res);
            })
        }
        arr.push([i, exports.makeMessage(temp), temp.slice(-1)[0]]);
        temp = [];

    }
    for(i = 0; i < arr.length; i++ ){
        if(arr[i][1]){
            let status = arr[i][2].length > 13 ? arr[i][2].slice(9) : arr[i][2];
            data = {
                zeitstampel: "2021-07-"+day+" "+exports.getTime(timesteps+2),
                content: "Patient with Device ID "+ arr[i][0] +" is "+ status,
                caregiverID: exports.getCareGiverID(arr[i][0])
            }
            await Notification.create(data);

        }
    }
}

exports.makeMessage = (statuses) => {
    return !statuses.slice(-4).includes('Normal');
}

exports.getCareGiverID = (id) => {
    let cg = "Null"
    for(var key in assignments){
        if(assignments[key].includes(id)){
            cg = key;
        }
    }
    return parseInt(cg.slice(-1));

}

exports.getTime = (timesteps) => {
    const base = 7.5;
    let time = base + (timesteps*0.5)
    let str = time % 1 == 0 ? time+":00" : Math.floor(time)+":30";
    if(time<10){
        str = "0"+str;
    } 
    return str;
}








