const config = require("./utils/config");
const app = express();
const express = require("express");
const cors = require("cors");
const personRouter = require("./controllers/persons");
const middleware = require("./utils/middleware");
const { infoLogger, errorLogger } = require("./utils/logger");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

infoLogger("connecting to", config.url);

mongoose
  .connect(config.url)
  .then(() => {
    infoLogger("connected to MongoDB");
  })
  .catch((error) => {
    errorLogger("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/persons", personRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
