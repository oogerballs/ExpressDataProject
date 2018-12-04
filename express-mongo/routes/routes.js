var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {

});

var personSchema = mongoose.Schema({
  username: String,
  password: String,
  age: String,
  email: String,
  animal: String
});

var Person = mongoose.model('People_Collection', personSchema);

exports.index = function (req, res) {
  Person.find(function (err, person) {
    if (err) return console.error(err);
    res.render('index', {
      title: 'People List',
      people: person
    });
  });
};

exports.create = function (req, res) {
  res.render('create', {
      title: 'Register'
  });
};

exports.createPerson = function (req, res) {
  var person = new Person({
    username: req.body.username,
    password: req.body.password,
    age: req.body.age,
    email: req.body.email,
    animal: req.body.Animal
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
    person.username = req.body.username;
    person.password = req.body.password;
    person.age = req.body.age;
    person.email = req.body.email;
    person.animal = req.body.animal;
    person.save(function (err, person) {
      if (err) return console.error(err);
      console.log(req.body.username + ' updated');
    });
  });
  res.redirect('/');

};

exports.delete = function (req, res) {
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
