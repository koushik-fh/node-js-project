const express = require("express");
const router = express.Router();
const { Users, validatestring,} = require("../models/users")
const _ = require("lodash")
const  bycrpt = require("bcrypt")

const auth = require("../middleware/auth")
const admin = require("../middleware/admin")


router.route("/api/me").get( [auth, admin], async (req, res) =>{

    const user = await Users.findById(req.user._id).select("-password")

    res.send(user)


})

router.route("/api/users").post( async (req,res) =>{

    try{
        const { error } = validatestring(req.body);
        if (error) return res.json({message:error.details[0].message})


            let user = await Users.findOne({ email: req.body.email })
      

            if(user) return res.status(400).send("user already exists")
     

             user = new Users(_.pick(req.body, ["name", "email", "password"]))

             const salt = await bycrpt.genSalt(10)
             user.password= await bycrpt.hash(user.password, salt)

             const token =  user.generateToken()
              await  user.save()
            

                return res.header("x-auth-jwt", token).status(200).send(_.pick(user, ["name", "email"]))



        }catch(err){
            res.status(400).send(err)
        }


  
})


module.exports = router