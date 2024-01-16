const infoLogger = (...params) => {
  console.info(...params);
};

const errorLogger = (...params) => {
  console.error(...params);
};

module.exports = {
  infoLogger,
  errorLogger,
};
