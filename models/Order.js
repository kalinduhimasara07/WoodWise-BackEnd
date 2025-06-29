import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  furnitureItems: [
    {
      sku: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
      note: {
        type: String,
        default: "No additional notes",
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  advanceAmount: {
    type: Number,
    required: true,
  },
  isPaymentCompleted: {
    type: Boolean,
    default: false,
  },
  customerInfo: {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  orderedBy: {
    type: String,
    default: "Store Manager",
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "In Production",
      "Ready for Delivery",
      "Completed",
      "Cancelled",
    ],
    default: "Pending",
  },
  millWorker: {
    type: String,
    default: "Not Assigned",
  },
  notes: {
    type: String,
    default: "No additional notes",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
