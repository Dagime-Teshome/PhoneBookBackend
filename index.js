const config = require("./utils/config");
const app = require("./app");
const { infoLogger } = require("./utils/logger");

config.port || 3001;
app.listen(config.port, () => {
  infoLogger(`Server listing on port:${config.port}`);
});
