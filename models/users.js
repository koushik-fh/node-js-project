const Joi = require("joi");

const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const config = require("config")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
         required:true,
         minlength:5, 
         maxlength:250
    },
    email:{
        type:String,
         required:true,
         minlength:5, 
         maxlength:250,
         unique:true
    },
    password:{
        type:String,
         required:true,
         minlength:5, 
         maxlength:250,
        
    },
    isAdmin:Boolean
})

userSchema.methods.generateToken = function(){
  const token = jwt.sign({_id:this._id, isAdmin: this.isAdmin }, config.get("jsonWebtokenkey"))
  return token

}

const Users = mongoose.model("users", userSchema)


const validatestring = (data) => {
    const schema = Joi.object({
      name: Joi.string().min(5).max(250).required(),
      email: Joi.string().min(5).max(250).required().email(),
      password: Joi.string().min(5).max(250).required(),
    });
  
    return schema.validate(data, );
  };

  module.exports = {
    Users,
    validatestring,
    
  }