import { expect } from 'chai';
import sinon from 'sinon';
import app from '#app';
import SubscriptionModel from '#models/subscriptionModel';
import emailService from '#services/emailService';
import { weatherService } from '#services/weatherService';
import { SubscriptionFrequency } from '#models/subscriptionModel';
import request from 'supertest';

describe('POST /api/subscribe', () => {
  let getWeatherStub: sinon.SinonStub;
  let findStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;
  let emailStub: sinon.SinonStub;
  let deleteStub: sinon.SinonStub;

  const mockSubscription = {
    id: 1,
    email: 'test@example.com',
    city: 'kyiv',
    frequency: SubscriptionFrequency.HOURLY,
    confirmation_token: '046ede256e04a87a19c6917e4a1fd82f3c792e1444a419db4568fcca0ec32c57',
    unsubscribe_token: '7e7f982a7759fb168bc9cd2b48a6749044b2154e122c48dae17a480447fa838d',
    confirmed: false,
  };

  beforeEach(() => {
    getWeatherStub = sinon.stub(weatherService, 'getWeatherByCity').resolves({
      success: true,
      statusCode: 200,
      data: {
        temperature: 22,
        humidity: 50,
        description: 'Clear sky',
      },
    });

    findStub = sinon
      .stub(SubscriptionModel, 'findByEmailAndCity')
      .resolves(null);
    createStub = sinon
      .stub(SubscriptionModel, 'create')
      .resolves(mockSubscription);
    emailStub = sinon.stub(emailService, 'sendConfirmationEmail').resolves();
    deleteStub = sinon.stub(SubscriptionModel, 'deleteSubscription').resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should subscribe successfully', async () => {
    const res = await request(app).post('/api/subscribe').type('form').send({
      email: 'test@example.com',
      city: 'kyiv',
      frequency: 'hourly',
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.equal(
      'Subscription successful. Confirmation email sent.',
    );
    sinon.assert.calledOnce(getWeatherStub);
    sinon.assert.calledOnce(createStub);
    sinon.assert.calledOnce(emailStub);
  });

  it('should return 400 for missing input', async () => {
    const res = await request(app)
      .post('/api/subscribe')
      .type('form')
      .send({ city: 'kyiv', frequency: 'hourly' });

    expect(res.status).to.equal(400);
    expect(res.body).to.equal('Invalid input');
  });

  it('should return 409 if already subscribed', async () => {
    findStub.resolves(mockSubscription);

    const res = await request(app).post('/api/subscribe').type('form').send({
      email: 'test@example.com',
      city: 'kyiv',
      frequency: 'hourly',
    });

    expect(res.status).to.equal(409);
    expect(res.body).to.equal('Email already subscribed');
  });

  it('should return 500 if email sending fails', async () => {
    emailStub.rejects(new Error('Email failed'));
    sinon.stub(console, 'error');

    const res = await request(app).post('/api/subscribe').type('form').send({
      email: 'test@example.com',
      city: 'kyiv',
      frequency: 'hourly',
    });

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: 'Internal server error' });
    sinon.assert.calledOnce(deleteStub);
  });
});
