const mongoose = require("mongoose");

let name = "";
let number = "";
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);
const getPersons = () => {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
};

const createPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`Person ${result.name} Saved with number ${result.number}`);
    mongoose.connection.close();
  });
};
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
} else {
  if (process.argv.length === 3) {
    getPersons();
  } else if (process.argv.length > 3) {
    name = process.argv[3];
    number = process.argv[4];
    createPerson(name, number);
  }
}
const password = process.argv[2];

const url = `mongodb+srv://dagimeteshome1:${password}@cluster0.caivdfi.mongodb.net/phonbookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);
