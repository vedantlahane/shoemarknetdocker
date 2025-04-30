const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  addressType: { type: String, enum: ['shipping', 'billing', 'both'], default: 'both' }
}, { timestamps: true });

module.exports = mongoose.model('Address', AddressSchema);
