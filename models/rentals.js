const mongoose = require("mongoose")
const Joi = require("joi");
const moment = require("moment");

const rentelSchema = new mongoose.Schema({
     customer: {
        type: new mongoose.Schema({
            name:{
                type:String,
                required:true,
                minlength:4,
                maxlenght:250
            },
            isGold:{
                type:Boolean,
                required:true,
            },  
            phoneNumber:{
                type:String,
                required:true,
                minlength:10,
                maxlenght:250
            }
        })
     },
     movie: {
        type: new mongoose.Schema({
            title:{
                type:String,
                trim:true,
                required:true,
                minlength:4,
                maxlenght:250
            },
            dailyRentalRate:{
                type:Number,
                required:true,
                minlength:10,
                maxlenght:250
            },  
          
        })
     },
     dateOut:{
        type:Date,
        required:true,
        default:Date.now
     },
     dateReturned:{
        type:Date,
      
     },
     rentalFeee:{
        type:Number,
        minlength:0
      
     }
  })


rentelSchema.statics.lookup = function(customerId, movieId){
  return this.findOne({
    "customer._id":customerId,
    "movie._id":movieId
  });
}  

rentelSchema.methods.return = function(){
  this.dateReturned = new Date()
  const rentalDays = moment().diff(this.dateOut, 'days')

  this.rentalFeee = rentalDays * this.movie.dailyRentalRate;
}

const Rentals =  mongoose.model('rentals', rentelSchema)

  const validatestring = (rental) => {
    const schema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required()
    });
  
    return schema.validate(rental);
  };

  module.exports={
    Rentals,
    validatestring
  }