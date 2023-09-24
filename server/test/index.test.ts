import request from "supertest" ;
import app from "./../index";
import db from "./../models/index"

let server:any;
const port = process.env.SERVER_DEV_PORT;

function startServer() {
  server = app.listen(port, () => {
  });
}

function stopServer() {
  if (server) {
    server.close(() => {
    });
  }
}

beforeAll(() => {
    startServer(); // Start the server before running tests
  });
  
  afterAll(() => {
    stopServer(); // Stop the server after all tests are done
  });
  
describe("should test the default route",() =>{

    it("returns Hello World!", async()=>{ 
        const res = await request(app).get('/');
        expect(res.text).toBe('Hello World!');
    })
})
