/*----------Object Example----------*/
var cat = {
  name: 'Pickle',
  age: 5
};

function updatePerson(obj) {
  //Won't update the object:
  // obj = {
  //   name: 'Pickle',
  //   age: 6
  // };

  //Will update the object
  obj.age = 6;
}

updatePerson(cat);
console.log(cat);

/*----------Array Example----------*/
var cats = ['Pickle', 'Peppercorn'];

function updateCats(array) {
  //Won't update the array:
  //array = ['Pickle', 'Peppercorn', 'Audrey'];

  //Will update the array
  array.push('Audrey');
}

updateCats(cats);
console.log(cats);

/*-----Or, you can use 'return'-----*/
var dogs = ['Pappi', 'Biscuit'];

function updateDogs(array) {
  return array = ['Pappi', 'Biscuit', 'Cookie', 'Pip', 'Husky', 'Lucky'];
}

dogs = updateDogs(dogs);
console.log(dogs);
