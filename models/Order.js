const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  furnitureItems: [
    {
      sku: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      unitPrice: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  customerInfo: {
    name: { type: String, required: true },
    contactNumber: { type: String },
    address: { type: String }
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // store staff
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Production', 'Ready for Delivery', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  millWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // mill worker who handles the order
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
