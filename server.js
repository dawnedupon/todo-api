var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); //Underscore
var db = require('./db.js');

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
//GET /todos?completed=true
//GET /todos?completed=true&q=eat
app.get('/todos', function(req, res) {
  var query = req.query;
  var where = {};

  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
    where.completed = false;
  }

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: '%' + query.q + '%'
    };
  }

  db.todo.findAll({where: where}).then( function(todos) {
    res.json(todos);
  }, function(e) {
    res.status(500).send();
  });

  //var queryParams = req.query;
  // var filteredTodos = todos;
  //
  // if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
  //   //_.where works even if this is true of more than one item
  //   filteredTodos = _.where(filteredTodos, {completed: true});
  // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
  //   filteredTodos = _.where(filteredTodos, {completed: false});
  // }
  //
  // if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
  //   filteredTodos = _.filter(filteredTodos, function(todo) {
  //     return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
  //   });
  // }
  //
  // res.json(filteredTodos);
});

//Get just one model
// GET /todos/:id
//Colon is what express uses to parse the data coming in
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);

  db.todo.findById(todoId).then(function(todo) {
      if (!!todo) { //if there is a todo item
        res.json(todo.toJSON());
      } else {
        res.status(404).send();
      }
  }, function(e) {
    res.status(500).send(); //500 means server error
  });

  // var matchedTodo = _.findWhere(todos, {
  //   id: todoId
  // });
  // if (matchedTodo) {
  //   res.json(matchedTodo);
  // } else {
  //   res.status(404).send();
  // }
});

// POST /todos
app.post('/todos', function(req, res) {
  //first argument: where you want to pick from, second argument: what you want picked. See underscorejs documentation
  var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON());
  }, function(e){
    res.status(400).json(e);
  });

  // //if body.completed is not a boolean or if body.description is not a string or there is an empty string
  // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  //   return res.status(400).send(); //"bad data"
  // }
  //
  // body.description = body.description.trim();
  //
  // //Add id field
  // body.id = todoNextId++;
  //
  // //Push body into array
  // todos.push(body);
  //
  // res.json(body);

});

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  // var matchedTodo = _.findWhere(todos, {
  //   id: todoId
  // });
  //
  // if (!matchedTodo) {
  //   res.status(404).json({
  //     "error": "No todo found with that id"
  //   });
  // } else {
  //   todos = _.without(todos, matchedTodo);
  //   res.json(matchedTodo);
  // }

  db.todo.destroy(body).then(function(todoId) {
    where: {
      id: todoId
    }
  }), function(e) {
    res.status(404).send();
  }


});

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {
    id: todoId
  });
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {}; //Object that stores the attributes we want to update

  if (!matchedTodo) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    //'completed' must exist and be a boolean
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    //'completed' exists but syntax is bad
    return res.status(400).send();
  } //else {
    //Never provided attribute. Continue with request
  //}

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  _.extend(matchedTodo, validAttributes); //(destination, source) extend copies all the properties in source objects to destination object
  res.json(matchedTodo);
});

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Express listening on Port ' + PORT + '!');
  });
});
