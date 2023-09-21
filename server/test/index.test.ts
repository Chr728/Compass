import request from "supertest" ;
import app from "./../index";
import db from "./../models/index"
// import { Sequelize, DataTypes } from 'sequelize';


// let mockSequelize = {};


  
//   jest.mock('./../models/index',() => {
//     return jest.fn(() => mockSequelize);
//   });

// jest.mock('sequelize', () => {
//     const mSequelize = {
//       authenticate: jest.fn(),
//       define: jest.fn(),
//     };
//     const actualSequelize = jest.requireActual('sequelize');
//     return { Sequelize: jest.fn(() => mSequelize), DataTypes: actualSequelize.DataTypes };
//   });
  
// jest.mock('./../models/index');
//  mockSequelize = {
//     authenticate: jest.fn(),
//     sync: jest.fn(),
//     close: jest.fn(),
//   };

// jest.mock('./../models/index', () => {
//   return { sequelize: {
//     authenticate: jest.fn(),
//     sync: jest.fn(),
//     close: jest.fn(),
//   } };
// });

// beforeAll(async () => {
//     try {
//       await db.sequelize.authenticate();
//       console.log('Database connection has been established successfully.');
//       // Synchronize the database, create tables, etc.
//       await db.sequelize.sync();
//     } catch (error) {
//       console.error('Unable to connect to the database:', error);
//     }
//   });
  
  // Your test cases here
  
//   afterAll(async () => {
//     // Close the database connection after all tests
//     await db.mockSequelize.close();
//   });


describe("should test the default route",() =>{


    it("returns Hello World!", async () => {
        const res = await request(app).get('/');
        expect(res.text).toBe('Hello World!');
    })

})
