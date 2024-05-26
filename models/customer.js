const Joi = require("joi");

const mongoose = require("mongoose")

const customers = new mongoose.Schema({
    name:{type: String, required:true, minlength:5, maxlenght:50},
    isGold:{type:Boolean, default:false},
    phoneNumber:{type:String, required:true,minlength:5, maxlenght:50},
  })
  
  const Customers =  mongoose.model('customers',customers)


const validatestring = (data) => {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      phoneNumber: Joi.string().min(5).max(50).required(),
      isGold: Joi.boolean()
    });
  
    return schema.validate(data);
  };
  

module.exports = {
    Customers,
    validatestring
}  