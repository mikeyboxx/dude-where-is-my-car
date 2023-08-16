const mongoose = require('mongoose');
const { Schema } = mongoose;

const parkedCarSchema = new Schema(
  {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true
  }
);


parkedCarSchema
  .virtual('createdTs')
  .get(function () {
    return `${new Date(this.createdAt).toISOString()}`;
  })

noteSchema
  .virtual('updatedTs')
  .get(function () {
    return `${new Date(this.updatedAt).toISOString()}`;
  })

const ParkedCar = mongoose.model('ParkedCar', noteSchema);

module.exports = ParkedCar;


