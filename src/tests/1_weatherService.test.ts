/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { weatherService } from '#services/weatherService';

describe('Test weatherService', () => {
  it('should return weather data for a valid city', async () => {
    const result = await weatherService.getWeatherByCity('London');

    expect(result.success).to.be.true;
    expect(result.statusCode).to.equal(200);
    expect(result.data).to.have.property('temperature');
    expect(result.data).to.have.property('humidity');
    expect(result.data).to.have.property('description');
  });

  it('should return error for invalid city', async () => {
    const result = await weatherService.getWeatherByCity('InvalidCity');

    expect(result.success).to.be.false;
    expect(result.statusCode).to.equal(404);
    expect(result.error).to.equal('City not found');
  });
});