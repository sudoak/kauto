const mongoose = require("mongoose");
// let Schema = mongoose.Schema;
// let SchemaTypes = mongoose.Schema.Types;

const Data = mongoose.model("data", {
  data: {
    type: String,
    required: true
    //minlength: 1
  },
  date: {
    type: String,
    require: true
  },
  timestamp: {
    type: String,
    required: true
    //minlength: 1
  }
});

module.exports = Data;
