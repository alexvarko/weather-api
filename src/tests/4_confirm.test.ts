import { expect } from 'chai';
import sinon from 'sinon';
import app from '#app';
import SubscriptionModel from '#models/subscriptionModel';
import { SubscriptionFrequency } from '#models/subscriptionModel';
import request from 'supertest';

describe('GET /api/confirm/:token', () => {
  let findByConfirmationTokenStub: sinon.SinonStub;

  const mockSubscription = {
    id: 1,
    email: 'test@example.com',
    city: 'kyiv',
    frequency: SubscriptionFrequency.HOURLY,
    confirmation_token:
      '046ede256e04a87a19c6917e4a1fd82f3c792e1444a419db4568fcca0ec32c57',
    unsubscribe_token:
      '7e7f982a7759fb168bc9cd2b48a6749044b2154e122c48dae17a480447fa838d',
    confirmed: false,
  };

  beforeEach(() => {});

  afterEach(() => {
    sinon.restore();
  });

  it('should confirm a subscription successfully', async () => {
    const confirmStub = sinon
      .stub(SubscriptionModel, 'confirmSubscription')
      .resolves();

    sinon
      .stub(SubscriptionModel, 'findByConfirmationToken')
      .resolves(mockSubscription);

    const res = await request(app).get(
      '/api/confirm/046ede256e04a87a19c6917e4a1fd82f3c792e1444a419db4568fcca0ec32c57',
    );

    expect(res.status).to.equal(200);
    expect(res.body).to.equal('Subscription confirmed successfully');
    sinon.assert.calledOnce(confirmStub);
    sinon.assert.calledWith(confirmStub, mockSubscription.id);
  });

  it('should return 404 if token not found in DB', async () => {
    findByConfirmationTokenStub = sinon
      .stub(SubscriptionModel, 'findByConfirmationToken')
      .resolves(null);

    const res = await request(app).get(
      '/api/confirm/7e7f982a7759fb168bc9cd2b48a6749044b2154e122c48dae17a480447fa838d',
    );

    expect(res.status).to.equal(404);
    expect(res.body).to.equal('Token not found');

    sinon.assert.calledOnce(findByConfirmationTokenStub);
  });

  it('should return 400 if token is invalid', async () => {
    const res = await request(app).get('/api/confirm/invalidtoken');

    expect(res.status).to.equal(400);
    expect(res.body).to.equal('Invalid token');
  });
});
