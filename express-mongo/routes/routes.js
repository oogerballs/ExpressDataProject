var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data', {useMongoClient:true});

var bcrypt = require('bcrypt-nodejs');
var myHash;

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {

});

var infoStuff = [];


function encrypt(the_str) {
  bcrypt.hash(the_str, null, null, function(err, hash){
    myHash = hash;
  });
  
}

var personSchema = mongoose.Schema({
  username: String,
  password: String,
  age: String,
  email: String,
  animal: String,
  color: String,
  aliens: String
});

var Person = mongoose.model('People_Collection', personSchema);

exports.index = function (req, res) {
  var animalDog = 0;
  var animalCat = 0;
  var animalBird = 0;
  var animalOther = 0;
  var animalTotal = 0;

  var colorBlue = 0;
  var colorRed = 0;
  var colorGreen = 0;
  var colorOther = 0;
  var colorTotal = 0;

  var aliensTrue = 0;
  var aliensFalse = 0;
  var aliensTotal = 0;

  
  Person.find(function (err, person) {
    if (err) return console.error(err);
    
    for(var i = 0; i< person.length; i++){
      if(person[i].animal == "Dog"){
        animalDog++;
      } else if(person[i].animal == "Cat"){
        animalCat++;
      } else if(person[i].animal == "Bird"){
        animalBird++;
      } else if(person[i].animal == "Other"){
        animalOther++
      }
      //////////////////

      if(person[i].color == "Blue"){
        colorBlue++;
      }else if(person[i].color == "Red"){
        colorRed++;
      }else if(person[i].color == "Green"){
        colorGreen++;
      }else if(person[i].color == "Other"){
        colorOther++;
      }
      /////////////////

      if(person[i].aliens == "True"){
        aliensTrue++;
      }else if(person[i].aliens == "False"){
        aliensFalse++;
      }
    }

    animalTotal = animalDog + animalCat + animalBird + animalOther;
    colorTotal = colorRed + colorBlue + colorGreen + colorOther;
    aliensTotal = aliensFalse + aliensTrue;

    infoStuff = [animalDog, animalCat, animalBird, animalOther, animalTotal,
    colorRed, colorBlue, colorGreen, colorOther, colorTotal,
    aliensFalse, aliensTrue, aliensTotal
    ];

    res.render('index', {
      people: person,
      "data": infoStuff
    });
  });
};

exports.create = function (req, res) {
  res.render('create', {
      title: 'Register'
  });
};

exports.createPerson = function (req, res) {
  encrypt(req.body.password);

  var person = new Person({
    username: req.body.username,
    password: myHash,
    age: req.body.age,
    email: req.body.email,
    animal: req.body.animal,
    color: req.body.color,
    aliens: req.body.aliens
  });

  
  person.save(function (err, person) {
    if (err) return console.error(err);
    console.log(req.body.username + ' added');
  });
  res.redirect('/');
};

exports.edit = function (req, res) {
  Person.findById(req.params.id, function (err, person) {
    if (err) return console.error(err);
    res.render('edit', {
      title: 'Edit Person',
      person: person
    });
  });
};

exports.editPerson = function (req, res) {
  Person.findById(req.params.id, function (err, person) {
    if (err) return console.error(err);
    encrypt(req.body.password);

    person.username = req.body.username;
    person.password = myHash;
    person.age = req.body.age;
    person.email = req.body.email;
    person.animal = req.body.animal;
    person.color = req.body.color;
    person.aliens = req.body.aliens;

    person.save(function (err, person) {
      if (err) return console.error(err);
      console.log(req.body.username + ' updated');
    });
  });
  res.redirect('/');

};

exports.delete = function (req, res) {

  animalTotal -=1;
  colorTotal -=1;
  aliensTotal -=1;

  if(req.body.animal == "Dog"){
    animalDog -=1;
  }
  if(req.body.animal == "Bird"){
    animalBird -=1;
  }
  if(req.body.animal == "Cat"){
    animalCat -=1;
  }
  if(req.body.animal == "Other"){
    animalOther -=1;
  }

  if(req.body.color == "Blue"){
    colorBlue -=1;
  }
  if(req.body.color == "Red"){
    colorRed -=1;
  }
  if(req.body.color == "Green"){
    colorGreen -=1;
  }
  if(req.body.color == "Other"){
    colorOther -=1;
  }

  if(req.body.aliens == "True"){
    aliensTrue -=1;
  }
  if(req.body.aliens == "False"){
    aliensFalse -=1;
  }

  Person.findByIdAndRemove(req.params.id, function (err, person) {
    if (err) return console.error(err);
    res.redirect('/');
  });
};

exports.details = function (req, res) {
  Person.findById(req.params.id, function (err, person) {
    if (err) return console.error(err);
    res.render('details', {
      title: person.username + "'s Details",
      person: person
    });
  });
};

exports.loginPerson = function (req, res) {
  Person.findOne({username: req.body.username , password: req.body.password}, function (err, person) {
      if(person == null || person == undefined){
      req.body.response = "Username or Password is incorrect"
      console.log(person);
      }else{
        var personID = person.id;
        res.redirect('/details/'+personID);
      }
  });
};

exports.login = function (req, res) {
  res.render('login', {
      title: 'Login Page'
  });
};

