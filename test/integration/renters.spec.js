/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
// const cp = require('child_process');
// const Apartment = require('../../dst/models/apartment');

// describe('bookmarks', () => {
//   beforeEach((done) => {
//     // run command script
//     cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
//       done();
//     });
//   });

describe('get /renters', () => {
  it('should get all the renters', (done) => {
    request(app)
      .get('/renters')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters).to.have.length(4);
        done();
      });
  });

  describe('get /renters/:id', () => {
    it('should get one renter', (done) => {
      request(app)
      .get('/renters/5783fe521a8f209018c07c1f')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter._id).to.equal('5783fe521a8f209018c07c1f');
        done();
      });
    });
  });

describe('post /renters', () => {
  it('should create an renter', (done) => {
    request(app)
    .post('/renters')
    .send({ name: 'Bob', money: 10000 })
    .end((err, rsp) => {
      expect(err).to.be.null;
      expect(rsp.status).to.equal(200);
      expect(rsp.body.renter.__v).to.not.be.null;
      expect(rsp.body.renter._id).to.not.be.null;
      expect(rsp.body.renter.name).to.equal('Bob');
      done();
    });
  });
});

describe('put /renters/:id/pay', () => {
  it('should pay the rent for the apartment', (done) => {
    request(app)
      .put('/renters/5783fe256e95533e18133b11/pay')
      .send({ apartment: '5783fe256e95533e18133b10' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.money).to.equal(8000);
        expect(rsp.body.apartment.collectedrent).to.equal(2000);

        done();
      });
  });
});
