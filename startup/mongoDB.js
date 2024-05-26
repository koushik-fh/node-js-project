
const mongoose = require("mongoose")
const logger = require("../startup/errorHandler")
const config = require("config")


 module.exports = function() {
    mongoose.connect(config.get('db'))
    .then(() => {

        console.log(`successfully connected to ${config.get('db')}`)})
   
} 