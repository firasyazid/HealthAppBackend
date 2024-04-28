

/// medecin testts
const request = require('supertest');
const app = require('../index');
const Medecin = require('../models/medecin');


const mongoose = require("mongoose");
require("dotenv/config");


////test db connection
beforeAll(async () => {
  await mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Health_App",
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Database Connection", () => {
  test("Should connect to the database", async () => {
    await new Promise((resolve) => {
      mongoose.connection.on("connected", () => {
        resolve();
      });
    });

    expect(mongoose.connection.readyState).toBe(1);
  });
});
  
describe('GET /medecin', () => {
    test('should return all medecins', async () => {
      const response = await request(app)
        .get('/api/v1/medecin');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });