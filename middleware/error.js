const logger = require("../startup/errorHandler")


module.exports.errortext  = function(err, req, res, next){
    logger.error(err.message, err)
    res.status(500).send("oops something went wrong")
 
 }


