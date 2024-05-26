const express = require("express");
const router = express.Router();
const {Rentals, validatestring} = require("../models/rentals")
const {Customers} = require("../models/customer")
const {Movies} = require("../models/movies")
const mongoose = require("mongoose")


router.route("/api/Rentals").get(async (req, res) =>{
    const response =  await Rentals.find().sort("-dateOut")
    res.send(response)
  
})

router.route("/api/Rentals").post(async (req, res) =>{

    try{
    const { error } = validatestring(req.body);
    if (error) return res.json({message:error.details[0].message});

    const customer = await Customers.findById(req.body.customerId)
    if(!customer) return res.json( {message: "customer not found"});

    const movie = await Movies.findById(req.body.movieId)
    if(!movie) return res.json({message: "movie not found"});

    const rental = new Rentals({
        customer:{
            _id:customer._id,
            name:customer.name,
            isGold:customer.isGold,
            phoneNumber:customer.phoneNumber
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }
    })

    const response =  await rental.save()

    movie.numberInStock--
    movie.save()

    res.json({ data :response})
    }catch(err){
      return res.json({message: err.message});
    }

  
     
  
})

module.exports = router
