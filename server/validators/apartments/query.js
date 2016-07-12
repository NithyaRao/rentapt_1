/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  page: joi.number().default(1),
  limit: joi.number().default(25),
  filter: joi.object().keys({
    sqft: joi.number(),
    bedrooms: joi.number(),
    floor: joi.number(),
    renter: joi.object(),
  }),
  sort: joi.object(),
  isVacant: joi.string(),
  sumCollectedRent: joi.number(),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.query, schema);

  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;
    console.log('********&&******', res.locals, res.locals.isVacant);
    if (res.locals.isVacant) {
      if (!res.locals.filter) {
        res.locals.filter = {};
      }
      res.locals.filter.renter = (res.locals.isVacant === true) ? { $eq: null } : { $ne: null };
      console.log('%%%%%******', res.locals);
    }
    res.locals.skip = (res.locals.page - 1) * res.locals.limit;
    next();
  }
};
