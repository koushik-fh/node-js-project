const express = require("express");
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const asyncHanlder = require("../middleware/asyncMiddleware")
const router = express.Router();
const {Genere, validatestring}  = require("../models/geners")
const validateObjectId = require("../middleware/validateObjectId");


router.get("/api/movieCategories", auth,  async (req, res) => {

const movieData = await Genere.find().limit(10)
  res.status(200).send(movieData);

});

router.get("/api/movieCategories/:id", async (req, res) => {
const id = req.params.id
try{
  const category = await Genere.findById(id)
  if(!category){
   res.status(400).send("data not found")
  }else{
    res.send(category);
  }
 }catch(err){
  res.send(err);
 }

});

router.post("/api/movieCategories",auth, async (req, res) => {
  const { error } = validatestring(req.body);
  if (error) return res.status(400).send(error.details[0].message);
 const category = {
    name: req.body.name,
  };
  const newGenere = new Genere(category)
try{
    const result = await newGenere.save();
    res.send(result);
   }catch(ex){
    res.send(ex.message)
   }

});


router.put("/api/movieCategories/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validatestring(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  const genre = await Genere.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(400).send("The genre with given id not found...");
  res.send(genre);
});

router.delete("/api/movieCategories/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genere.findByIdAndDelete(req.params.id);

  if (!genre) return res.status(404).send("Genre id not found");

  res.send(genre);
});


module.exports = router;
