var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
  id: 1,
  description: 'Chew paper',
  completed: false
}, {
  id: 2,
  description: 'Inspect plants',
  completed: false
}, {
  id: 3,
  description: 'Show belly to David',
  completed: true
}];

app.get('/', function(req, res) {
  res.send('Todo API Root');
});

//Get the whole collection
//GET /todos
app.get('/todos', function(req,res) {
  //convert the string to JSON first, then send it back to whoever called the API
  res.json(todos);
});

//Get just one model
// GET /todos/:id
//Colon is what express uses to parse the data coming in
app.get('/todos/:id', function(req,res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo;

  todos.forEach(function(todo) {
    if (todoId === todo.id) {
        matchedTodo = todo;
    }
  });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }

});

app.listen(PORT, function() {
  console.log('Express listening on Port ' + PORT + '!');
});
