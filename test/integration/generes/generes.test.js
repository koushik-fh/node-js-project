const request = require("supertest");
const { Genere } = require("../../../models/geners");
const {Users} = require("../../../models/users")
const jwt = require('jsonwebtoken')
const config = require("config")
const mongoose = require('mongoose')


describe("api/genres", () => {

  beforeEach(() => {
    server = require("../../../server");
  });
  afterEach(async () => {
    await Genere.deleteMany({})
    
    await server.close(); // Ensure the server is closed
   
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await   Genere.collection.insertMany([
        {name: 'genere-1'},
        {name:'genere-2'}
      ])

    const payload = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin:true}
    const user = new Users(payload)
    const token = user.generateToken();

      const res = await request(server).get("/api/movieCategories").set('x-auth-jwt', token);
   
      expect(res.status).toBe(200);
     expect(res.body.length).toBe(2)
     expect(res.body.some(g => g.name === "genere-1")).toBeTruthy()
     expect(res.body.some(g => g.name === "genere-2")).toBeTruthy()
    });
  });


  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genere({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/movieCategories/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 error if no valid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
  });


  describe("POST /", () => {
    let token;
    beforeEach(() => {
      token = new Users().generateToken();
    });
      const exec = async (name = "genre1") => {
      return await request(server)
        .post("/api/movieCategories")
        .set("x-auth-jwt", token)
        .send({ name });
    };
    it("should return 401 if client is not logged in", async () => {
      token = "";
    
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 3 characters", async () => {
      
      const res = await exec("12");
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is greter than 3 characters", async () => {

      const string = new Array(53).join('a')
      
      const res = await exec(string);
      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
     
      const res = await exec();
 
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let newName;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .put("/api/movieCategories/" + id)
        .set("x-auth-jwt", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genere({ name: "genre1" });
      await genre.save();

      token = new Users().generateToken();
      id = genre._id;
      newName = "updatedName";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();
       expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      newName = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if genre with the given id was not found", async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should update the genre if input is valid", async () => {
      await exec();

      const updatedGenre = await Genere.findById(genre._id);

      expect(updatedGenre.name).toBe(newName);
    });

    it("should return the updated genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });


  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/movieCategories/" + id)
        .set("x-auth-jwt", token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genere({ name: "genre1" });
      await genre.save();

      id = genre._id;
      token = new Users({ isAdmin: true }).generateToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new Users({ isAdmin: false }).generateToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id was found", async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the genre if input is valid", async () => {
      await exec();

      const genreInDb = await Genere.findById(id);

      expect(genreInDb).toBeNull();
    });

    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });

 
});