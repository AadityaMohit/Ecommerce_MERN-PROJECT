const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  product: {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
  },
  status: {
    type: String,
    enum: ['initialized', 'packed', 'outForDelivery'], // Order status tracking
    default: 'initialized',  // Default status when an order is created
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', OrderSchema);
