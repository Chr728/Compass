import request from "supertest" ;
import app from "./../index";
// import db from "./../models/index"
// import { Sequelize, DataTypes } from 'sequelize';
// const mSequelize = {};

// jest.mock('./../models/index', () => {
//   return { sequelize: mSequelize };
// });

// const mockSequelize = {
//     authenticate: jest.fn(),
//     sync: jest.fn(),
//   };
  
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
  


describe("should test the default route",() =>{


    it("returns Hello World!", async () => {
        const res = await request(app).get('/');
        expect(res.text).toBe('Hello World!');
    })

})
