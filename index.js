const express = require("express");
const Person = require("./models/person");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);
morgan.token("person", function (req, res) {
  return JSON.stringify(req.body);
});

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((result) => {
      response.status(200).json(result);
    })
    .catch((e) => {
      next(e);
    });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        return response.status(404).end("content not found");
      }
    })
    .catch((e) => {
      next(e);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((res) => {
      if (res) {
        response.status(204).end("request successful");
      } else {
        response.status(404).end("not found");
      }
    })
    .catch((e) => {
      next(e);
    });
});

app.post("/api/persons", (request, response, next) => {
  let body = request.body;
  // todo: implement duplicate entry logic
  let person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((result) => {
      response.status(200).json(result);
    })
    .catch((e) => {
      next(e);
    });
});

app.get("/api/info", (request, response) => {
  Person.countDocuments({}).then((result) => {
    let responseText = `<h1>PhoneBook has ${result} contacts</h1> \n\n${new Date()} `;
    response.status(200).send(responseText);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// handler of requests with result to errors
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listing on port:${PORT}`);
});
