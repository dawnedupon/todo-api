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

var User = sequelize.define('user', {
  email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
  //force: true
}).then(function() {
  console.log('Everything is synced.');

  User.findById(1).then(function(user) {
    user.getTodos({
      where: {
        completed: false
      }
    }).then(function (todos){
      todos.forEach(function(todo){
        console.log(todo.toJSON());
      });
    });
  });
  // User.create({
  //   email: 'pickle@sofa.com'
  // }).then(function() {
  //   return Todo.create({
  //     description: 'Pounce on hooman'
  //   });
  // }).then(function(todo) {
  //   User.findById(1).then(function(user) {
  //     user.addTodo(todo);
  //   });
  // });
});
