var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); //Underscore

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

//anytime a JSON request comes in, express will parse it
//and we will be able to access it via req.body
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Todo API Root');
});

//Get the whole collection
//GET /todos
app.get('/todos', function(req, res) {
  //convert the string to JSON first, then send it back to whoever called the API
  res.json(todos);
});

//Get just one model
// GET /todos/:id
//Colon is what express uses to parse the data coming in
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  // var matchedTodo;
  // todos.forEach(function(todo) {
  //   if (todoId === todo.id) {
  //       matchedTodo = todo;
  //   }
  // });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

// POST /todos
app.post('/todos', function(req, res) {
  //first argument: where you want to pick from, second argument: what you want picked. See underscorejs documentation
  var body = _.pick(req.body, 'description', 'completed');

  //if body.completed is not a boolean or if body.description is not a string or there is an empty string
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send(); //"bad data"
  }

  body.description = body.description.trim();

  //Add id field
  body.id = todoNextId++;

  //Push body into array
  todos.push(body);

  res.json(body);
});

app.listen(PORT, function() {
  console.log('Express listening on Port ' + PORT + '!');
});
