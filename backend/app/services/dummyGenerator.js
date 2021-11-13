const db = require("../models");
const Event = db.event;
const SerializedEvent = db.serializedEvent;
const sequelize = require("sequelize");
const {Op} = require("sequelize");
var Chance = require('chance');
var chance = new Chance();

//Dividing the patients to groups. [deviceID,avg. cup size, [Cup Number Range], [Respective weights of cup numbers],Routine]
//The weights assigned to the cup numbers is to introduce weighted probability
let  drinkers = [[2,245,[4,5,6,7],[1,1,8,1],"R1"],[4,235,[4,5,6,7,8],[1,2,10,2,1],"R1"],[6,229,[6,7,8,9,10],[1,2,10,2,1],"R3"],
[8,223,[4,5,6,7,8],[1,2,10,2,1],"R1"],[10,239,[6,7,8,9,10],[1,1,10,1,1],"R5"],[12,221,[4,5,6,7,8],[1,2,10,2,1],"R1"],
 [14,249,[4,5,6,7],[1,1,10,1],"R1"],[16,226,[5,6,7,8],[1,1,8,1],"R2"],[18,227,[4,5,6,7],[1,8,2,1],"R4"],
 [20,250,[5,6,7,8],[1,10,2,1],"R1"],[1,240,[4,5,6],[1,8,1],"R5"],[3,220,[6,7,8,9,10],[10,8,3,1,1],"R2"],
[5,215,[5,6,7,8],[5,5,3,2],"R4"],[11,220,[3,4,5],[5,10,1],"R5"],[13,210,[3,4,5],[5,10,1],"R3"],
[7,250,[8,9,10,11],[1,2,10,10],"R3"],[9,240,[7,8,9,10],[1,2,3,8],"R2"],[15,220,[6,7,8,9],[1,2,5,10],"R5"]
,[17,245,[6,7,8],[1,5,2],"R4"],[19,240,[7,8,9,10],[1,5,10,8],"R3"]];

let  correctDrinkers1 = [[2,245,6,"R1"],[4,235,6,"R1"],[6,229,8,"R3"],
[8,223,6,"R1"],[10,239,8,"R5"],[12,221,6,"R1"],
 [14,249,6,"R1"],[16,226,7,"R2"],[18,227,5,"R4"],
 [20,250,6,"R1"],[1,240,6,"R5"],[3,252,9,"R2"],
[5,249,7,"R4"],[11,222,5,"R5"],[13,260,4,"R3"],
[7,250,9,"R3"],[9,240,7,"R2"],[15,255,6,"R5"]
,[17,236,6,"R4"],[19,233,6,"R3"]];

let  correctDrinkers = [[2,245,[4,5,6,7],[1,1,8,1],"R1"],[4,235,[4,5,6,7,8],[1,2,10,2,1],"R1"],[6,229,[6,7,8,9,10],[1,2,10,2,1],"R3"],
[8,223,[4,5,6,7,8],[1,2,10,2,1],"R1"],[10,239,[6,7,8,9,10],[1,1,10,1,1],"R5"],[12,221,[4,5,6,7,8],[1,2,10,2,1],"R1"],
 [14,249,[4,5,6,7],[1,1,10,1],"R1"],[16,226,[5,6,7,8],[1,1,8,1],"R2"],[18,227,[4,5,6,7],[1,8,2,1],"R4"],
 [20,250,[5,6,7,8],[1,10,2,1],"R1"],[1,240,[4,5,6],[1,1,8],"R5"],[3,252,[6,7,8,9,10],[1,1,3,10,5],"R2"],
[5,249,[5,6,7,8],[1,2,9,1],"R4"],[11,222,[3,4,5],[1,2,8],"R5"],[13,260,[3,4,5],[2,10,1],"R3"],
[7,250,[8,9,10,11],[1,10,2,1],"R3"],[9,240,[7,8,9,10],[8,2,1,1],"R2"],[15,255,[6,7,8,9],[12,2,2,1],"R5"]
,[17,236,[6,7,8],[7,2,1],"R4"],[19,233,[6,7,8,9],[15,3,2,1],"R3"]];

let truth = [[1,[0,19.8,46.5,58.2]],[2,[71.6,61.1,54.1,58.8]],[3,[106.3,109.7,99.9,93.8]], //True rates for each patient assuming NO external factors like hot weather or vomiting
[4,[69.8,59.6,54.4,58.9]],[5,[38.0,39.3,57.2,72.4]],[6,[118.1,115.8,90.7,75.8]],[7,[147.8,150.6,115.5,96.7]],
[8,[67.0,57.2,52.7,54.1]],[9,[96.6,92.2,84.4,75.6]],[10,[0,21.7,58.0,79.9]],[11,[9.2,18.8,36.3,41.9]],[12,[68.3,56.3,51.8,55.1]],
[13,[58.4,62.3,42.1,42.2]],[14,[75.0,59.0,52.9,59.1]],[15,[0,20.6,51.4,69.2]],[16,[71.7,72.2,67.7,63.9]],
[17,[43.9,41.9,58.2,63.8]],[18,[11.8,24.3,43.1,50.7]],[19,[87.9,88.8,72.4,63.6]],[20,[83.0,65.2,60.2,65.2]]]



//NOTE: Sequelize inserts with -2 Hours (Make timestamps 2 hours later than they're intended)
//switch from real data to correct data: 1- correctDrinkers statt drinkers 2- comments
const generate = async () => {
    for(var day = 1; day<32; day++){
        var dayString = day<10 ? "0"+day+" " : day+" ";
        for(var i = 0; i< correctDrinkers.length; i++){
            let id = correctDrinkers[i][0]
            // let nCups = chance.weighted(drinkers[i][2], drinkers[i][3]);
            // let nCups = correctDrinkers[i][2]
            let nCups = chance.weighted(correctDrinkers[i][2], correctDrinkers[i][3]);

            // let timings = generateTimings(drinkers[i][4],nCups);
            let timings = generateTimings(correctDrinkers[i][4],nCups);
            let amounts = generateAmounts(correctDrinkers[i][1], nCups);
            for(var j = 0; j<nCups; j++){
                let data = {
                    menge: amounts[j],
                    zeitstampel: "2021-07-" + dayString +timings[j],
                    patientDeviceID: id
                }
                await Event.create(data);
                // console.log("Event " + (j+1) +" done");
            }
            // console.log("Patient "+ id+ " done");

        }
        // console.log("Day " + day + " done");

    }
    return;
}

const getTotals = async () => {
    var day = 1;
    var sums = new Array(20);
    for(var j =0; j<20; j++){
        sums[j] = 0;
    }
    var sum = 0;
    while(day<32){
        var dayString = day<10 ? "0"+day : day+"";
        console.log(("Day "+ day+":"));
        await Event.findAll({
        attributes: ['PatientDeviceID', [sequelize.fn('sum', sequelize.col('menge')), 'total']],
        group : ['Event.PatientDeviceID'],
        raw: true,
        order: sequelize.literal('PatientDeviceID ASC'),
        where:{
            zeitstampel: {
                [Op.startsWith]: "2021-07-"+dayString
            }

        }
  }).then((v)=> {
      for(var i = 0; i< v.length; i++){
          sums[i]+= Math.abs(v[i].total - (truth[i][1][3]*24));
      }
  });
    day++;
    // console.log("///////////////////////////////////////////////////")
    }
    for(var k =0; k<sums.length; k++){
        sums[k]/=30;
    }
    console.log(sums);
}


const generateTimings = (routine, nCups) =>{
    let timings = new Array(nCups);
    let nLeft; //Represents the number of cups from 8AM till 2PM (First half of the day)
    let nRight;// 2PM - 8PM
    let leftArray;
    let rightArray;
    switch(routine){
        case "R1": //(Almost) evenly distributed events among the day
            timings = generateTimingsHelper(10,12,nCups);
            break;

        case "R2": //Events are slightly more in the first day half.
            nLeft = Math.floor(0.625*nCups); //Weights were tested with different values to emphasize the behaviour of this Routine
            nRight = Math.ceil(0.375*nCups); //Weights that accomodate a wider range of nCups were chosen.
            leftArray = generateTimingsHelper(10,6,nLeft);
            rightArray = generateTimingsHelper(16,6,nRight);
            timings = leftArray.concat(rightArray);
            break;
        case "R3": //Events are mostly in the first day half
            nLeft = Math.floor(0.8*nCups);  
            nRight = Math.ceil(0.2*nCups); 
            leftArray = generateTimingsHelper(10,6,nLeft);
            rightArray = generateTimingsHelper(16,6,nRight);
            timings = leftArray.concat(rightArray);
            break;

        case "R4": //Events are slightly more in the second day half
            nLeft = Math.floor(0.375*nCups);
            nRight = Math.ceil(0.625*nCups); 
            leftArray = generateTimingsHelper(10,6,nLeft);
            rightArray = generateTimingsHelper(16,6,nRight);
            timings = leftArray.concat(rightArray);
            break;

        case "R5": //Events are mostly in the second half of the day
            nLeft = Math.floor(0.2*nCups);  
            nRight = Math.ceil(0.8*nCups); 
            leftArray = generateTimingsHelper(10,6,nLeft);
            rightArray = generateTimingsHelper(16,6,nRight);
            timings = leftArray.concat(rightArray);
            break;
    }
    return timings;

}

const generateTimingsHelper = (startingHour, hours, nCups) => { //Distributes events from startingHour until startingHour+hours
    let t = hours / (nCups - 1);                                //Timeframes are +-30 minutes for events in the middle and 1 hour
    let timings = new Array(nCups);                             //after or before unrandomized timing for 1st and last events respectively
    let minutes = Math.floor(Math.random()*60);
    let seconds = Math.floor(Math.random()*60);
    timings[0] = startingHour + ":" + minutes + ":" + seconds;
    minutes = Math.floor(Math.random()*60);
    seconds = Math.floor(Math.random()*60);
    timings[nCups - 1] = (startingHour+ hours -1)+":" + minutes + ":" + seconds;
    for(var i = 1; i<nCups - 1; i++){
        startingHour+=t;
        minutes = Math.floor((startingHour%1)*60);
        seconds = Math.floor(Math.random()*60);
        let hour = Math.floor(startingHour);
        minutes += (Math.floor(Math.random() * 61) -30)
        if(minutes < 0 ){
            hour-=1;
            minutes+= 60;
        }
        if(minutes >= 60){
            hour+=1;
            minutes-=60;
        }
        timings[i] = hour + ":" + minutes + ":" + seconds;
    }
    return timings;
}

const  generateAmounts = (avgCupSize, nCups) =>{
    let amounts = new Array(nCups);
    for(var i = 0; i< nCups; i++){
        amounts[i] = Math.floor(Math.random()*41) + avgCupSize -20;
    }
    return amounts;
    

}

const analytics = (id, day) => {
    var dayString = day<10 ? "0"+day : day+"";
    Event.findAll({
        attributes: ['menge','zeitstampel'],
        where:{
            patientDeviceID: id,
            zeitstampel: {
                [Op.startsWith]: "2021-04-"+dayString
            }
            
        }
    }).then((v) => {
        let amounts = new Array(v+2);
        let timings = new Array(v+2);
        // amounts[0], amounts[v.length-1],timings[0],timings[v.length-1] = 0
        for(var i = 0; i< v.length; i++){
            let time = (v[i].dataValues.zeitstampel+"").split(' ');
            amounts[i] = v[i].dataValues.menge

            timings[i] = time[4].split(':')
            let fraction = timings[i][1]/60
            timings[i] = Math.floor(timings[i][0]) + fraction -2
            // console.log(timings[i])
        }

        console.log("Amounts: "+ amounts)
        console.log("Timings: "+ timings);
    }) 

}

const regularizeSeries = async () => {
    for(day = 1; day < 32; day++){
        const dayString = day<10 ? "0"+day : day+"";
        for(id = 1; id<21 ; id++){
            let time = 8; 
            while(time<20){
                let d1 = new Date("2021-07-"+dayString+" "+formatTime(time));
                let d2 = new Date("2021-07-"+dayString+" "+formatTime(time+0.5));
                d1.setHours(d1.getHours()+2);
                d2.setHours(d2.getHours()+2);
                await Event.findAll({
                    attributes: ['patientDeviceID',[sequelize.fn('sum', sequelize.col('menge')), 'total']],
                    where:{
                        patientDeviceID: id,
                        zeitstampel:{
                            [Op.gte]: d1,
                            [Op.lt]:   d2
                        },            
                     },

                }).then(async (entry)=>{
                    const res = {
                        patientDeviceID: id,
                        menge: entry[0].dataValues.total? entry[0].dataValues.total:0 ,
                        zeitstampel: d1
                    }
                    await SerializedEvent.create(res);
                })
            
            // else{
            //     const res = {
            //         patientDeviceID: id,
            //         menge: 0,
            //         zeitstampel: d1
            //     }
            //     await SerializedEvent.create(res)
            // }  
                time+=0.5;
            }
        }
    }
}

const formatTime = (time) => {
    time = time%24;
    let hour = Math.floor(time);
    let minutes = Math.round((time%1)*60);
    hour= hour<10? "0"+hour : ""+hour
    minutes= minutes<10? "0"+minutes : ""+minutes;
    return hour+":"+minutes+":"+"00"
}

const t = async () => {
    const tuple = {
        patientDeviceID: 1,
        menge: 555,
        zeitstampel: "2021-06-01 2:00:00"
    }
    await SerializedEvent.create(tuple);
    return;
}
const tt = () => {
    let date = new Date("2021-05-31 00:00:00");
    date.setHours(date.getHours()+2.5);
    console.log(date);
    SerializedEvent.create({patientDeviceID:3, menge:555, zeitstampel: date})
}

