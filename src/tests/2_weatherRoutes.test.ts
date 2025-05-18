import request from 'supertest';
import { expect } from 'chai';
import app from '../app';

describe('GET /api/weather', () => {
  it('should return 200 and weather data for a valid city', async () => {
    const res = await request(app).get('/api/weather?city=Paris');
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('temperature');
    expect(res.body).to.have.property('humidity');
    expect(res.body).to.have.property('description');
  });

  it('should return 404 for invalid city', async () => {
    const res = await request(app).get('/api/weather?city=InvalidCity123');

    expect(res.status).to.equal(404);
    expect(res.body).to.equal('City not found');
  });

  it('should return 400 for no city specified', async () => {
    const res = await request(app).get('/api/weather');

    expect(res.status).to.equal(400);
    expect(res.body).to.equal('Invalid request');
  });
});