const jwt = require("jsonwebtoken")
const config = require("config")

module.exports  = function (req, res, next){

    const token =  req.header("x-auth-jwt")

    if(!token) return res.status(401).send("token not exists")

    try{
        const decoded = jwt.verify(token , config.get("jsonWebtokenkey"))

         req.user = decoded
         next()

    }catch(err){
        return res.status(400).send(err)
    }


}

