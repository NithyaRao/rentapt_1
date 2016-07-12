/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Apartment from '../models/apartment';
import Renter from '../models/renter';
import bodyValidator from '../validators/apartments/body';
import queryValidator from '../validators/apartments/query';
import paramsValidator from '../validators/apartments/params';
const router = module.exports = express.Router();

// create
router.post('/', bodyValidator, (req, res) => {
  Apartment.create(res.locals, (err, apartment) => {
    res.send({ apartment });
  });
});

// update
router.put('/:id/lease', bodyValidator, paramsValidator, (req, res) => {
  Apartment.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, apartment) => {
    Renter.findByIdAndUpdate(res.locals.renter, { apartment: apartment._id }, { new: true }, (err1, renter) => {
      res.send({ renter });
    });
  });
});

// index
router.get('/', queryValidator, (req, res) => {
  // if (res.locals.renter === undefined) {
  Apartment.find(res.locals.filter)
            .sort(res.locals.sort)
            .limit(res.locals.limit)
            .skip(res.locals.skip)
            .exec((err, apartments) => {
              console.log('Inside query Validator', err, apartments);
              if (!res.locals.sumCollectedRent) {
                Apartment.sumCollectedRent(apartments, () => {
                  // res.send({ renter, apartment });
                  console.log('SumCollectedRent');
                });
              }
              res.send({ apartments });
            });
});

// show
router.get('/:id', paramsValidator, (req, res) => {
  Apartment.findById(req.params.id, (err, apartment) => {
    res.send({ apartment });
  });
});
