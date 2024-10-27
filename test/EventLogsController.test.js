import * as chai from 'chai';
import supertest from 'supertest';
import app from '../server.js';
import EventLogs from '../models/EventLogs.js';

const { expect } = chai;
const request = supertest(app);

describe('EventLogs Controller', () => {

  beforeEach(async () => {
    // Clear the event logs collection before each test
    await EventLogs.deleteMany({});
  });

  describe('GET /eventLogs', () => {
    beforeEach(async () => {
      // Insert some test event logs into the database
      await EventLogs.insertMany([
        { eventType: 'Event1', timestamp: new Date('2023-01-01T00:00:00Z'), user: 'User1', productId: '123', data: {}, description: 'Description1' },
        { eventType: 'Event2', timestamp: new Date('2023-01-02T00:00:00Z'), user: 'User2', productId: '456', data: {}, description: 'Description2' },
        { eventType: 'Event3', timestamp: new Date('2023-01-03T00:00:00Z'), user: 'User3', productId: '789', data: {}, description: 'Description3' },
      ]);
    });

    it('should retrieve all event logs sorted by timestamp in descending order', (done) => {
      request
        .get('/eventLogs')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(3);

          // Check the order of the event logs
          expect(res.body[0]).to.have.property('eventType', 'Event3');
          expect(res.body[1]).to.have.property('eventType', 'Event2');
          expect(res.body[2]).to.have.property('eventType', 'Event1');

          done();
        });
    });
  });
});