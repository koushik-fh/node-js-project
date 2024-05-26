const express = require("express");
const router = express.Router();
const {Users} = require("../models/users")
const _ = require("lodash")
const  bycrpt = require("bcrypt")
const Joi = require("joi");
const jwt = require("jsonwebtoken")
const config = require("config")



router.route("/api/authenticate").post( async (req,res) =>{
    try{
   

        const { error } = validatestring(req.body);
     
        if (error) return res.json({message:error.details[0].message})
     


            let user = await Users.findOne({ email: req.body.email })
            if(!user) return res.status(400).send("user not existing")

            const hash =  await  bycrpt.compare(req.body.password, user.password)
     
            if(!hash) return res.status(400).send("password did not match")

              

                const token = user.generateToken()

                res.send(token)
     }catch(err){
            res.status(400).send(err)
        }


  
})


const validatestring = (data) => {
    const schema = Joi.object({
      email: Joi.string().min(5).max(250).required().email(),
      password: Joi.string().min(5).max(250).required(),
    });
  
    return schema.validate(data);
  };

module.exports = router