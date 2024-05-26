const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const validate = require("../middleware/validate");

const { Rentals } = require("../models/rentals");
const { Movies } = require("../models/movies");
const { Customers } = require("../models/customer");
const auth = require("../middleware/auth");
const express = require("express");
// const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

router.post("/api/returns",[auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rentals.lookup(req.body.customerId, req.body.movieId)

  if (!rental) return res.status(404).send("Rental not found.");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.return();
  await rental.save();



const movie = await Movies.findById(rental.movie._id);
  movie.numberInStock++;
  await movie.save();

    
  return res.status(200).send(rental)






});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

module.exports = router;