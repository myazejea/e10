var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Create a Schema
var StudentInfoSchema = new Schema({
  firstName: String,
  lastName: String,
  degree: String,
  program: String,
  date: String,
  email: String
});

//Create a Model
mongoose.connect('mongodb://localhost/student', { useUnifiedTopology: true });

var StudentInfo = mongoose.model('studentInfo', StudentInfoSchema);

module.exports = StudentInfo;
