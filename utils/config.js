require("dotenv").config();

const config = {
  port: process.env.PORT,
  url: process.env.MONGODB_URI,
};

module.exports = config;
