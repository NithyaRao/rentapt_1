/* eslint-disable func-names, no-param-reassign, consistent-return, no-underscore-dangle */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  money: { type: Number, required: true },
  apartment: { type: mongoose.Schema.ObjectId, ref: 'Apartment' },
  createdAt: { type: Date, default: Date.now },
});


schema.methods.payrent = function (apartment, cb) {
  if (this.money < apartment.rent) return cb();

  this.money -= apartment.rent;
  apartment.collectedrent += apartment.rent;

  this.save(() => {
    apartment.save(() => {
      cb();
    });
  });
};

module.exports = mongoose.model('Renter', schema);
