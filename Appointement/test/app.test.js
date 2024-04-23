const request = require('supertest');
const app = require('../index');  
 
 
describe('GET /appointement', () => {
  test('should return all appointments', async () => {
    const response = await request(app)
      .get('/api/v1/appointement');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

test('should return 404 if appointment ID does not exist', async () => {
    const nonExistentId = '66223f3b9e0157cebb33b04a';
    const response = await request(app)
      .delete(`/api/v1/appointement/${nonExistentId}`);
  
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Appointment not found!');
  });
  