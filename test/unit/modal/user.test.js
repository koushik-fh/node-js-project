const {Users} = require("../../../models/users")
const jwt = require('jsonwebtoken')
const config = require("config")
const mongoose = require('mongoose')

describe("user.generateJwtToken", () =>{

    it('should return a valid jwt' , () =>{
        const payload = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin:true}
        const user = new Users(payload)
        const token = user.generateToken();
        const decoded = jwt.verify(token ,config.get("jsonWebtokenkey"))
        expect(decoded).toMatchObject(payload)
    })

})

