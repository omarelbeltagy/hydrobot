exports.getRDDA = (weight, height, gender, age, activityLevel, lossFactor) =>{
    const s = gender == 0? 5 : -161;
    let activityMultiplier;

    switch(activityLevel){
        case 1: activityMultiplier = 1.2; break;
        case 2: activityMultiplier = 1.375; break;
        case 3: activityMultiplier = 1.55; break;
        case 4: activityMultiplier = 1.725; break;
        case 5: activityMultiplier = 1.9; break;
        default: activityMultiplier =1; break;
    }


    let TDEE = ((10*weight)+(6.25*height)-(5*age)+s)*activityMultiplier;
    let RDDA = TDEE * 1.1 * 0.8;
    RDDA+= 500*lossFactor;
    return RDDA;
    
}

