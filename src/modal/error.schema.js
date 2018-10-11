let mongoose  = require('mongoose')

var Records = mongoose.model('error', {
    data: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    timestamp:{
        type: String,
        required: true,
        minlength: 1
    }
  });
  
  module.exports = Records