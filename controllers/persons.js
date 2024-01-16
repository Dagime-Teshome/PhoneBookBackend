const Person = require("../models/person");
const personRouter = require("express").Router();

personRouter.get("/", (request, response, next) => {
  Person.find({})
    .then((result) => {
      response.status(200).json(result);
    })
    .catch((e) => {
      next(e);
    });
});

personRouter.get("/:id", (request, response, next) => {
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

personRouter.put("/:id", (request, response, next) => {
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

personRouter.delete("/:id", (request, response, next) => {
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

personRouter.post("/", (request, response, next) => {
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

personRouter.get("/api/info", (request, response) => {
  Person.countDocuments({}).then((result) => {
    let responseText = `<h1>PhoneBook has ${result} contacts</h1> \n\n${new Date()} `;
    response.status(200).send(responseText);
  });
});

module.exports = personRouter;
