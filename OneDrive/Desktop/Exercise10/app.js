var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongodb = require('mongodb');
var path = require('path');
var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017/student', { useUnifiedTopology: true });
var count = 0;
var app = express();
var StudentInfo = require('./models/studentInfo');
var mongoose = require('mongoose');
var urlencodedParser = bodyParser.urlencoded({ extended: false});
//ES6 Promise stops the "DeprecationWarning" by installing this library

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));//This is middleware to use or get styles.css code to be used
//app.use('/student',routes);

app.get('/', function(req, res){
    res.render('index', {prefilled:"", readOnly:"", count: count, action: "/saveNewStudent"});
});

app.get('/update/:id', function(req, res){
    StudentInfo.find({_id: req.params.id}).then(data => {
      let prefilled = {firstName: data[0].firstName, lastName: data[0].lastName};
      res.render('index', {prefilled: prefilled, readOnly: "readonly", count: count, action: `/checkAndSave/${req.params.id}`});
    })
});

app.post('/checkAndSave/:id', urlencodedParser, function(req, res){
  StudentInfo.findOneAndUpdate(
    {_id: req.params.id},
    {
      degree: req.body.degree,
      program: req.body.program,
      date: req.body.date,
      email: req.body.email
    },
    (err, doc) => {
      res.redirect('/savedStudents')
    }
  );

});
app.post('/saveNewStudent', urlencodedParser, async function(req, res){
  var stud = new StudentInfo({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    degree: req.body.degree,
    program: req.body.program,
    date: req.body.date,
    email: req.body.email
  });
  //find if student with this firstName and lastName is in the database
  //if they are then call findOneAndUpdate
  //if they are not then save


  await stud.save(function(data){
    //assert(data.isNew === false);
    res.redirect('/savedStudents')

  });

  count++;
  //select all students from database
  //render that list of students to savedStudents views

});

app.post('/collection', urlencodedParser, (req, res) => {
  StudentInfo.findOneAndRemove({_id: req.body.idToDel}, (err) => {
    if (err) {
      res.redirect(200, '/')
    }
    res.redirect('/savedStudents')

  });
});

app.get("/savedStudents", (req, res)=> {
  StudentInfo.find({}).then(function(result){
    res.render('savedStudents', {data: result})
  });
});

app.use(function(req, res, next){
  if(req.method == "POST"){
     var count = req.session.count;
     console.log(count);
  }
  next();
});

app.listen(process.env.port || 4000, function(){
  console.log('app started!');
  console.log('listening for requests');
});
