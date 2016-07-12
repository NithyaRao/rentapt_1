/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Renter from '../models/renter';
import Apartment from '../models/apartment';
import bodyValidator from '../validators/renters/body';
import queryValidator from '../validators/renters/query';
import paramsValidator from '../validators/apartments/params';
const router = module.exports = express.Router();

// create
router.post('/', bodyValidator, (req, res) => {
  Renter.create(res.locals, (err, renter) => {
    res.send({ renter });
  });
});

router.put('/:id/pay', bodyValidator, paramsValidator, (req, res) => {
  Renter.findById(req.params.id, (err1, renter) => {
    Apartment.findById(renter.apartment, (err2, apartment) => {
      renter.payrent(apartment, () => {
        res.send({ renter, apartment });
      });
    });
  });
});

// index
router.get('/', queryValidator, (req, res) => {
  // if (res.locals.renter === undefined) {
  Renter.find(res.locals.filter)
            .sort(res.locals.sort)
            .limit(res.locals.limit)
            .skip(res.locals.skip)
            .exec((err, renters) => {
              console.log('Inside query Validator', err, renters);
              res.send({ renters });
            });
});

// show
router.get('/:id', paramsValidator, (req, res) => {
  Renter.findById(req.params.id, (err, renter) => {
    res.send({ renter });
  });
});
