

/// medecin testts
const request = require('supertest');
const app = require('../index');
const Medecin = require('../models/medecin');

  
describe('GET /appointement', () => {
    test('should return all medecins', async () => {
      const response = await request(app)
        .get('/api/v1/medecin');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });