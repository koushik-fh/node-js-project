const Joi = require("joi");

const mongoose = require("mongoose")
const {genereSchema} = require("../models/geners")


const movieSchema = new mongoose.Schema({
  title:{type: String, required:true, trim:true, minlength:5, maxlenght:50},
  geners:{
    type:genereSchema,
    required:true
  },

  numberInStock:{type: Number, required:true, minlength:5, maxlenght:255},
  dailyRentalRate:{type: Number, required:true, minlength:5, maxlenght:255},

})

const Movies = mongoose.model('movies', movieSchema)

const validatestring = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    generId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  });

  return schema.validate(data);
};





module.exports = {
  Movies,
  validatestring
}


