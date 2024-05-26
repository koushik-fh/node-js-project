const express = require("express");
const category = require("../routes/generRouter");
const customers = require("../routes/customerRoutes")
const movies = require("../routes/moviesRouter")
const Rentals = require("../routes/rentalRouter")
const users = require("../routes/userRoutes")
const auth = require("../routes/authRouter")
const returns = require("../routes/returns")
const {errortext} = require("../middleware/error")


module.exports = function(app){
    app.use(express.json());
    app.use(category);
    app.use(customers);
    app.use(movies)
    app.use(Rentals)
    app.use(users)
    app.use(returns)
    app.use(auth)
    app.use(errortext)
}