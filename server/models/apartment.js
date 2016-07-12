import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  sqft: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  floor: { type: Number, required: true },
  rent: { type: Number, required: true },
  collectedRent: { type: Number },
  renter: { type: mongoose.Schema.ObjectId, ref: 'Renter' },
  createdAt: { type: Date, default: Date.now },
});

schema.methods.sumCollectedRent = function (apartments, cb) {
  cb(apartments.reduce((acc, apt) => {
    return acc + apt.collectedRent;
  }, 0));
};

module.exports = mongoose.model('Apartment', schema);
