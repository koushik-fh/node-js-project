const express = require("express");
const router = express.Router();
const {Movies, validatestring} = require("../models/movies")
const {Genere} = require("../models/geners")


router.post("/api/movie", async (req, res) => {
    const { error } = validatestring(req.body);
    if (error) return res.send(error.details[0].message);

    try{
        const genere = await Genere.findById(req.body.generId)
        if(!genere) {
            return res.send("genere not found")
        }else{
            let movie = new Movies({
                title: req.body.title,
                geners:{
                    id : genere._id,
                    name:genere.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate:req.body.numberInStock
            })

            const result = movie.save()

            if(result){
                res.send("successfully")
            }
        }
    }catch(ex){
        res.send(ex.message)
    }

   
  


  
  });

  router.get("/api/movie", async (req, res) => {
    const movieData = await Movies.find().limit(10)
    try{
    res.send(movieData);
    }catch(err){
      res.send(err)
  
    }
  });

module.exports = router;
