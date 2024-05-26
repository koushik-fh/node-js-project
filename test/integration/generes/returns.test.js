const moment = require("moment");
const request = require("supertest");

const { Movies } = require("../../../models/movies");
const {Users} = require("../../../models/users")
const mongoose = require("mongoose");
const { Rentals } = require("../../../models/rentals");
const {Customers} = require("../../../models/customer")
describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;



  beforeEach(async () => {
    server = require("../../../server");

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new Users().generateToken();
    // customer = new Customers({
    //     _id: customerId,
    //     name: "12345",
    //     phone: "12345",
    //   })

    movie = new Movies({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      geners: { name: "12345" },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rentals({
      customer: {
        _id: customerId,
        name: "123456",
        phoneNumber: "1234569888888",
        isGold:true,
      },
      movie: {
        _id: movieId,
        title: '123456',
        dailyRentalRate:2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    

     await Rentals.deleteMany({})
     await Movies.deleteMany({})
     await server.close();
 
  });

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-jwt", token)
      .send({ customerId ,movieId});
  };


  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for the customer/movie", async () => {

   await Rentals.deleteMany({})

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if we have a valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the returnDate if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rentals.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should set the rentalFee if input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rentals.findById(rental._id);
    expect(rentalInDb.rentalFeee).toBe(14);
  });

  it("should increase the movie stock if input is valid", async () => {
    const res = await exec();

    const movieInDb = await Movies.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return the rental if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rentals.findById(rental._id);

 
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFeee",
        "customer",
        "movie",
      ])
    );
  });
});