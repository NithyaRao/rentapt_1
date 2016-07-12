/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
// const Apartment = require('../../dst/models/apartment');

describe('apartments', () => {
  beforeEach((done) => {
    // run command script
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('get /apartments', () => {
    it('should get all the apartments', (done) => {
      request(app)
        .get('/apartments')
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.apartments).to.have.length(3);
          done();
        });
    });
    it('should filter apartments by sqft, bedrooms,floor', (done) => {
      request(app)
        .get('/apartments?filter[sqft]=1800&filter[bedrooms]=4&filter[floor]=2')
        .end((err, rsp) => {
          console.log('FILTER%%%%%%', rsp.body.apartments);
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.apartments).to.have.length(1);
          expect(rsp.body.apartments[0].bedrooms).to.equal(4);
          done();
        });
    });
    it('should filter all vacant apartments', (done) => {
      request(app)
        .get('/apartments?isVacant=true')
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.apartments).to.have.length(3);
          done();
        });
    });
    it('should filter all occupied apartments', (done) => {
      request(app)
        .get('/apartments?isVacant=false')
        .end((err, rsp) => {
          console.log('******occupied *******', rsp.body.apartments);
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.apartments).to.have.length(0);
          done();
        });
    });
    it('should return total of all collected rent of all apts', (done) => {
      request(app)
        .get('/apartments?sumCollectedRent=0&isVacant=true')
        .end((err, rsp) => {
          console.log('******sumCollected *******', rsp.body.apartments);
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.apartments).to.have.length(0);
          done();
        });
    });
  });

  describe('get /apartments/:id', () => {
    it('should get one apartment', (done) => {
      request(app)
      .get('/apartments/5783fe256e95533e18133b10')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment._id).to.equal('5783fe256e95533e18133b10');
        done();
      });
    });
  });
  describe('get /apartments/:id', () => {
    it('should get one apartment', (done) => {
      request(app)
      .get('/apartments/5783fe256e95533e18133b10')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment._id).to.equal('5783fe256e95533e18133b10');
        done();
      });
    });
  });
  describe('post /apartments', () => {
    it('should create an apartment', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'a1', sqft: 1800, bedrooms: 4, floor: 2, rent: 2000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.__v).to.not.be.null;
        expect(rsp.body.apartment._id).to.not.be.null;
        expect(rsp.body.apartment.name).to.equal('a1');
        done();
      });
    });
  });

  describe('put /apartments/:id/lease', () => {
    it('should assign appartment to a renter', (done) => {
      request(app)
        .put('/apartments/5783fe256e95533e18133b10/lease')
        .send({ renter: '5783fe256e95533e18133b11' })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.renter.apartment).to.equal('5783fe256e95533e18133b10');
          done();
        });
    });
  });
});
