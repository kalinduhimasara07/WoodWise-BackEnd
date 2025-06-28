import mongoose from "mongoose";

const timberSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      "Teak",
      "Oak",
      "Mahogany",
      "Pine",
      "Walnut",
      "Bamboo",
      "Ash",
      "Rosewood",
      "Rubberwood",
      "Bodhi",
      "Mango",
      "Yaka",
      "Halmilla",
      "Vatica",
      "Rambutan",
      "Kumbuk",
      "Balan",
      "Dumbara",
      "Hedar",
      "Sassafras",
      "Kachchan",
      "Millettia",
      "Koss",
      "Lunumidella",
      "Kandula",
      "Berrya",
      "Cinnamon",
      "Ruhuna",
    ],
  },
  grade: {
    type: String,
    trim: true,
    enum: ["Premium", "Standard", "Economy"],
    default: "Standard",
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  dimensions: {
    length: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  inStock: {
    type: Boolean,
    default: true,
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

timberSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

timberSchema.index({ species: 1 });
timberSchema.index({ sku: 1 });
timberSchema.index({ name: "text", description: "text" });

const Timber = mongoose.model("Timber", timberSchema);

export default Timber;
