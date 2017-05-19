var Sequelize = require('sequelize');
//Instance of the above
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false, //don't want users to create a todo without a description
    validate: {
      //length must be between 1 and 250 characters
      len: [1, 250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

sequelize.sync({
  //force: true
}).then(function() {
  console.log('Everything is synced.');

  //CHALLENGE:
  //Find by ID, print to the screen in json
  //If one can't find it, print an error message saying "Todo not found!"
  Todo.findById(3).then(function(todo) {
    if (todo) {
      console.log(todo.toJSON());
    } else {
      console.log('Todo not found!');
    }
  });

  // Todo.create({
  //   description: 'Tear up paper',
  // }).then(function(todo) {
  //   return Todo.create({
  //     description: 'Nap in wardrobe'
  //   });
  // }).then(function() {
  //   //return Todo.findById(1)
  //   return Todo.findAll({ //Search by various criteria, eg. completed
  //     where: {
  //       description: {
  //           $like: '%paper%'
  //       }
  //     }
  //   });
  // }).then(function(todos) {
  //     if (todos) {
  //       todos.forEach(function(todo) {
  //         console.log(todo.toJSON());
  //       });
  //     } else {
  //       console.log('No todos found!');
  //     }
  // }).catch(function(e) {
  //   console.log(e);
  // });

});
