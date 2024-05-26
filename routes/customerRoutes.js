
const express = require("express");
const {validatestring, Customers} = require("../models/customer")
const router = express.Router();


  router.get("/api/customers", async (req, res) => {
    const customerData = await Customers.find().limit(10)
    try{
    res.send(customerData);
    }catch(err){
      res.send(err)
  
    }
  });
  
  router.get("/api/customers/:id", async (req, res) => {
  const id = req.params.id
  try{
   const customers = await Customers.findById(id)
 if(!customers){
     res.status(400).send("data not found")
    }else{
      res.send(customers);
    }
   }catch(err){
    res.send(err);
   }
  
  });
  
  router.post("/api/customers", async (req, res) => {
    const { error } = validatestring(req.body);
    if (error) return res.send(error.details[0].message);
   const customerData = {
      name: req.body.name,
      phoneNumber:req.body.phoneNumber ,
      isGold:req.body.isGold
    };
    const newCustomer = new Customers(customerData)
  try{
      const result = await newCustomer.save();
      res.send(result);
     }catch(ex){
      res.send(ex.message)
     }
  
  });

  router.put("/api/customers/:id", async (req, res) => {
    const { error } = validatestring(req.body);
    if (error) return res.send(error.details[0].message);
    const customerData = {
      name: req.body.name,
      phoneNumber:req.body.phoneNumber ,
      isGold:req.body.isGold
    };

    try{

      const updatedData = await Customers.findByIdAndUpdate(req.params.id, {
        $set:customerData
        }, {new:true})
    
        res.send(updatedData)
    }catch(ex){
      res.send(ex.message)
     }
});
  
router.delete("/api/customers/:id", async (req, res) => {
  try{
    const deletedData = await Customers.findByIdAndDelete(req.params.id)

    console.log(deletedData)

    if(deletedData){
      res.send(deletedData)
    }else{
      res.send("data not deleted")
    }
     }catch(ex){
    res.send(ex.message)
   }

});

  
 
 


module.exports = router;