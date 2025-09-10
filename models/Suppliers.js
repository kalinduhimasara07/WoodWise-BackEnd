import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, default: "Sri Lanka" },
    postalCode: { type: String },
  },

  // Supplied timbers list
  supplies: [
    {
      timberCategory: {
        type: String,
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
        required: true,
      },
      grade: {
        type: String,
        enum: ["Premium", "Standard", "Economy"],
        default: "Standard",
      },
      pricePerUnit: {
        type: Number,
        required: true,
        min: 0,
      },
      stockAvailable: {
        type: Number,
        min: 0,
        default: 0,
      },
      description: {
        type: String,
        trim: true,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  active: {
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

// Auto-update timestamp
supplierSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for search
supplierSchema.index({ companyName: "text", contactPerson: "text", email: 1 });

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
