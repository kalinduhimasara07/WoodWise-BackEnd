import mongoose from "mongoose";

const furnitureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Living Room",
      "Bedroom",
      "Dining Room",
      "Office",
      "Kitchen",
      "Bathroom",
      "Outdoor",
    ],
  },
  subcategory: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  salePrice: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  woodType: {
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
    ],
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  weight: {
    type: Number,
    min: 0,
  },
  color: {
    type: String,
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
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
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  images: [
    {
      url: String, // The URL of the image (Supabase public URL)
      size: Number,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  models: [
    {
      url: String, // The URL of the 3d model (Supabase public URL)
      size: Number,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  inStock: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
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

furnitureSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

furnitureSchema.index({ category: 1 });
furnitureSchema.index({ sku: 1 });
furnitureSchema.index({ name: "text", description: "text" });

const Furniture = mongoose.model("Furniture", furnitureSchema);

export default Furniture;
