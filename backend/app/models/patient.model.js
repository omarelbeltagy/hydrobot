const {getRDDA} = require("../services/rddaCalculator.js");


module.exports = (sequelize, Sequelize) => {
    const Patient = sequelize.define("patient", {
      deviceID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fName:{
          type: Sequelize.STRING
      },
      lName:{
          type: Sequelize.STRING
      },
      gender:{
        type: Sequelize.BOOLEAN  //Assuming 0->male 1->female
      },
      age:{
        type: Sequelize.INTEGER
      },
      height:{
        type: Sequelize.INTEGER
      },
      weight:{
        type: Sequelize.DOUBLE
      },
      activityLevel: {
        type: Sequelize.INTEGER // Integer in [1,5] describing 5 activity levels
      },
      lossFactor:
      {
        type: Sequelize.INTEGER // Integer in [0,2] describing normal
                                // no additional loss rate (0), diarrhea (1), vomiting (1) or both (2)
      },
      dailyGoal: {
        type: Sequelize.INTEGER, // Optimal daily amount in mililiters.
        set(value){
          this.setDataValue('dailyGoal',getRDDA(this.weight,this.height,this.gender,this.age,this.activityLevel,this.lossFactor))
        }, //This is triggered whenever a value is assigned to the patient.dailyGoal with an '=',
        // To reflect the update of this column whenever the relevant column(s) is/are updated,
         //add tuple.dailyGoal = null (or anything, it does nothing with the value anyways) to the handler method
         //so that the setter gets triggered with the changed values
      },
      status:{
        type: Sequelize.STRING
      }


    },{timestamps: false});




    // Patient.create({fName: "Kai", lName: "Siegel", gender: 0, age: 84, height: 173, weight: 70, activityLevel: 1, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Warinot", lName: "Lorenz", gender: 0, age: 79, height: 180, weight: 76, activityLevel: 4, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Manni", lName: "Schmitz", gender: 0, age: 88, height: 172, weight: 75, activityLevel: 1, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Killian", lName: "Weiss", gender: 0, age: 90, height: 175, weight: 69, activityLevel: 1, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Klaus", lName: "Meine", gender: 0, age: 81, height: 178, weight: 73, activityLevel: 2, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Meinard", lName: "Weber", gender: 0, age: 86, height: 182, weight: 80, activityLevel: 2, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Horst", lName: "Zimmermann", gender: 0, age: 77, height: 183, weight: 89, activityLevel: 3, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Albert", lName: "Vogel", gender: 0, age: 91, height: 171, weight: 65, activityLevel: 1, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Franz", lName: "Martell", gender: 0, age: 85, height: 179, weight: 70, activityLevel: 2, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Daniel", lName: "Berger", gender: 0, age: 72, height: 178, weight: 82, activityLevel: 2, lossFactor: 0, dailyGoal: null });


    // Patient.create({fName: "Anneliese", lName: "Jaeger", gender: 1, age: 94, height: 168, weight: 63, activityLevel: 1, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Sofia", lName: "Gantzman", gender: 1, age: 88, height: 163, weight: 68, activityLevel: 2, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Elisa", lName: "Schneck", gender: 1, age: 97, height: 162, weight: 62, activityLevel: 1, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Maria", lName: "Haas", gender: 1, age: 85, height: 171, weight: 75, activityLevel: 2, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Anneke", lName: "Mueller", gender: 1, age: 80, height: 170, weight: 62, activityLevel: 3, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Angelika", lName: "Meier", gender: 1, age: 76, height: 168, weight: 65, activityLevel: 3, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Luise", lName: "Stark", gender: 1, age: 90, height: 175, weight: 69, activityLevel: 2, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Mariele", lName: "Schumacher", gender: 1, age: 92, height: 166, weight: 66, activityLevel: 1, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Emilie", lName: "Keller", gender: 1, age: 86, height: 178, weight: 80, activityLevel: 1, lossFactor: 0, dailyGoal: null  });
    // Patient.create({fName: "Nadja", lName: "Wiegand", gender: 1, age: 84, height: 173, weight: 92, activityLevel: 1, lossFactor: 0, dailyGoal: null  });







      
    return Patient;
  };