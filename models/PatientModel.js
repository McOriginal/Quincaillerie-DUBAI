const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Masculin', 'Féminin'],
      default: 'Masculin',
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    groupeSanguin: {
      type: String,
    },
    ethnie: {
      type: String,
    },
    profession: {
      type: String,
    },

    adresse: {
      type: String,
      required: true,
      max: 30,
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
