const config = require("config")


module.exports = function(){

    if(!config.get("jsonWebtokenkey")){
        throw new Error("Fatal error jwttoken needed")
    }

}