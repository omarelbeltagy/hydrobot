library(tsintermittent)

#* @param data
#* @post /status
function(data){
  ts <- ts(data = data, frequency= 24)
  model <- crost(ts,type= 'sba',h = 24)
  model$frc.out[1]
  }

