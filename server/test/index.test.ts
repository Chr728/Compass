import request from "supertest" ;
import app from "./../index";
import db from "./../models/index"


describe("should test the default route",() =>{


    it("returns Hello World!", async () => {
        const res = await request(app).get('/');
        expect(res.text).toBe('Hello World!');
    })

})
