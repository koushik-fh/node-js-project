const express = require("express");
const app = express();
require("./startup/router")(app)
require("./startup/prod")(app)
require("./startup/mongoDB")()
require("./startup/config")()
require("./startup/validation")()


const port = process.env.PORT || 6000;

 module.exports =  app.listen(port, () => {
  console.log(`app is running in ${port}`);
});
