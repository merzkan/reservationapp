const mongoose = require("mongoose");

const exceptionSchema = new mongoose.Schema({
  date: { 
    type: Date 
  },                 
  startDate: { 
    type: Date 
  },            
  endDate: { 
    type: Date 
  },  
  startTime: { 
    type: String 
  },
  endTime: { 
    type: String 
  },
});

module.exports = mongoose.model("Exception", exceptionSchema);
