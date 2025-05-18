import { expect } from 'chai';
import sinon from 'sinon';
import app from '#app';
import SubscriptionModel, {
  SubscriptionFrequency,
} from '#models/subscriptionModel';
import request from 'supertest';

describe('GET /api/unsubscribe/:token', () => {
  const mockSubscription = {
    id: 1,
    email: 'test@example.com',
    city: 'kyiv',
    frequency: SubscriptionFrequency.HOURLY,
    unsubscribe_token:
      '7e7f982a7759fb168bc9cd2b48a6749044b2154e122c48dae17a480447fa838d',
    confirmed: true,
  };

  afterEach(() => {
    sinon.restore();
  });

  it('should unsubscribe successfully', async () => {
    const findStub = sinon
      .stub(SubscriptionModel, 'findByUnsubscribeToken')
      .resolves(mockSubscription);
    const deleteStub = sinon
      .stub(SubscriptionModel, 'deleteSubscription')
      .resolves();

    const res = await request(app).get(
      '/api/unsubscribe/7e7f982a7759fb168bc9cd2b48a6749044b2154e122c48dae17a480447fa838d',
    );

    expect(res.status).to.equal(200);
    expect(res.body).to.equal('Unsubscribed successfully');
    sinon.assert.calledOnce(findStub);
    sinon.assert.calledWith(
      findStub,
      '7e7f982a7759fb168bc9cd2b48a6749044b2154e122c48dae17a480447fa838d',
    );
    sinon.assert.calledOnce(deleteStub);
    sinon.assert.calledWith(deleteStub, mockSubscription.id);
  });

  it('should return 404 if token not found in DB', async () => {
    const findStub = sinon
      .stub(SubscriptionModel, 'findByUnsubscribeToken')
      .resolves(null);

    const res = await request(app).get(
      '/api/unsubscribe/046ede256e04a87a19c6917e4a1fd82f3c792e1444a419db4568fcca0ec32c57',
    );

    expect(res.status).to.equal(404);
    expect(res.body).to.equal('Token not found');
    sinon.assert.calledOnce(findStub);
    sinon.assert.calledWith(
      findStub,
      '046ede256e04a87a19c6917e4a1fd82f3c792e1444a419db4568fcca0ec32c57',
    );
  });

  it('should return 400 if token is invalid', async () => {
    const res = await request(app).get('/api/unsubscribe/invalidtoken');

    expect(res.status).to.equal(400);
    expect(res.body).to.equal('Invalid token');
  });
});
