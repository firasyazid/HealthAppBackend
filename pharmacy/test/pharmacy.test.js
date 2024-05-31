 
const request = require('supertest');
const app = require('../index');
const { Pharmacy } = require('../models/pharmacy');
const mongoose = require("mongoose");
require("dotenv/config");
const serverUtils = require("../server");


 
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

 

describe('POST /api/v1/pharmacy', () => {
    test('should return 200 if all required fields are provided', async () => {
        const response = await request(app)
            .post('/api/v1/pharmacy')
            .send({
                name: 'Pharmacy Name',
                phone: '123456789',
                region: '65f828a889d1c6456b7ceda4',
                type: '65f82fbd6630c135ed9d7cfe',
                address: 'Address',
                location: [9.0333, 38.7000]
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('name', 'Pharmacy Name');
        expect(response.body).toHaveProperty('phone', '123456789');
        expect(response.body).toHaveProperty('region', '65f828a889d1c6456b7ceda4');
        expect(response.body).toHaveProperty('type', '65f82fbd6630c135ed9d7cfe');
        expect(response.body).toHaveProperty('address', 'Address');
        expect(response.body).toHaveProperty('location', [9.0333, 38.7000]);
    });
});

describe('POST /api/v1/RegionPharmacy', () => {
    test('should return 200 if all required fields are provided', async () => {
        const response = await request(app)
            .post('/api/v1/RegionPharmacy')
            .send({
                name: 'Region Name'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('name', 'Region Name');
    });
});


describe('POST /api/v1/RegionPharmacy', () => {
    test('should return 404 if name is missing', async () => {
        const response = await request(app)
            .post('/api/v1/RegionPharmacy')
            .send({});
    
        expect(response.status).toBe(404);
        expect(response.text).toBe('Name is required for creating a region.');
    });
    
});

afterAll(async () => {
  await serverUtils.closeServer();
});