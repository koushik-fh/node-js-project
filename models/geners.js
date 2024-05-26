const mongoose = require("mongoose")
const Joi = require("joi");



const genereSchema = new mongoose.Schema({
    name:{type: String, required:true, minlength:5, maxlenght:50}
  })
  
  const Genere =  mongoose.model('genere',genereSchema)

const validatestring = (data) => {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
    });
  
    return schema.validate(data);
  };

  module.exports = {
    Genere,
    validatestring,
    genereSchema
  }
  