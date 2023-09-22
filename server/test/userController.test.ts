import request from "supertest" ;
import app from "./../index";
import db from "./../models/index"

let server:any;
const port = process.env.SERVER_DEV_PORT;

function startServer() {
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

function stopServer() {
  if (server) {
    server.close(() => {
      console.log('Server stopped');
    });
  }
}

beforeAll(() => {
    startServer(); // Start the server before running tests
  });
  
  afterAll(() => {
    stopServer(); // Stop the server after all tests are done
  });

describe("should test the getUsers Controller",() =>{

    it("show get all users",async()=>{

        const user = {
             
            "city": "city", 
            "birthDate": "2022-09-13",
            "email": "123@gmail.com", 
            "firstName": "Jane", 
            "id": 1, 
            "lastName": "Doe", 
            "phoneNumber": "1234567890", 
            "postalCode": "H3C 0H8", 
            "province": "string", 
            "sex": "sex", 
            "streetAddress": "streetAddress", 
            "uid": "firebase"}
        jest.spyOn(db.User, 'findAll').mockResolvedValueOnce(user);
        const res = await request(app).get('/api/users/');
        expect(db.User.findAll).toBeCalledTimes(1)
        expect(res.status).toBe(200);
        expect(res.body.data).toStrictEqual(user);
    })

    it("should give error", async()=>{

        jest.spyOn(db.User, 'findAll').mockRejectedValue(new Error('connection error'));
        const res = await request(app).get('/api/users/');
        expect(db.User.findAll).toBeCalledTimes(2);
        expect(res.status).toBe(400);

    })

})
