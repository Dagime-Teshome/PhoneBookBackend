const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);
morgan.token("person", function (req, res) {
  return JSON.stringify(req.body);
});
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const MAXId = Math.max(...persons.map((person) => person.id));
  return MAXId + 1;
};

app.get("/api/persons", (request, response) => {
  response.status(200).json(persons);
});
app.get("/api/persons/:id", (request, response) => {
  const ID = Number(request.params.id);
  let person = persons.find((person) => person.id === ID);
  if (!person) {
    return response.status(404).end("content not found");
  }
  response.status(200).send(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const ID = Number(request.params.id);
  persons = persons.filter((person) => person.id !== ID);
  response.status(202).end("request successful");
});

app.post("/api/persons", (request, response) => {
  let body = request.body;
  if (!body.name && body.number) {
    return response.status(400).json({
      error: "Bad Request",
    });
  } else if (persons.findIndex((person) => person.name === body.name) !== -1) {
    return response.status(400).json({
      error: "{ error: 'name must be unique' }",
    });
  }
  let person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = [...persons, person];
  response.status(200).json(person);
});
app.get("/api/info", (request, response) => {
  let responseText = `<h1>PhoneBook has info for ${
    persons.length
  } people</h1> \n\n${new Date()} `;
  response.status(200).send(responseText);
});

const port = 3002;
app.listen(port, () => {
  console.log(`Server listing on port:${port}`);
});
