const { errorLogger, infoLogger } = require("./logger");

const requestLogger = (request, response, next) => {
  infoLogger("Method:", request.method);
  infoLogger("Path:  ", request.path);
  infoLogger("Body:  ", request.body);
  infoLogger("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  errorLogger(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
