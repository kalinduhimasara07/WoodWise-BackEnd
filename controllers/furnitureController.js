import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import Furniture from "../models/furniture.js";

//handle adding furniture
export async function addFurniture(req, res) {
  try {
    console.log("Request Body:", req.body);  // For debugging purposes
    console.log("Files:", req.files);  // Check the files uploaded
    console.log("Images:", req.body.images);  // Check if images array is being received

    const { 
      name, 
      category, 
      subcategory, 
      price, 
      salePrice, 
      description, 
      woodType, 
      dimensions, 
      weight, 
      color, 
      brand, 
      stock, 
      sku, 
      tags, 
      inStock, 
      featured 
    } = req.body;

    if (!name || !category || !price || !description || !woodType || !stock || !sku) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    const parsedDimensions = dimensions ? JSON.parse(dimensions) : {};
    const parsedTags = tags ? JSON.parse(tags) : [];

    // If images is a string, make it an array of URLs
    const imageData = Array.isArray(req.body.images) 
      ? req.body.images.map((url) => ({ url }))  // Directly store the URL if it's an array
      : req.body.images 
      ? [{ url: req.body.images }]  // If it's a string, wrap it in an array
      : [];

    const modelData = req.files.models
      ? req.files.models.map((file) => ({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path, // Save the model file locally
          size: file.size,
          mimetype: file.mimetype,
        }))
      : [];

    const furniture = new Furniture({
      name: name.trim(),
      category,
      subcategory: subcategory || "",
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      description: description.trim(),
      woodType,
      dimensions: parsedDimensions,
      weight: weight ? parseFloat(weight) : null,
      color: color || "",
      brand: brand || "",
      stock: parseInt(stock),
      sku: sku.trim(),
      tags: parsedTags,
      images: imageData,  // Saving the image URLs now
      models: modelData,  // Saving the model files locally
      inStock: inStock === "true" || inStock === true,
      featured: featured === "true" || featured === true,
    });

    const savedFurniture = await furniture.save();

    res.status(201).json({
      success: true,
      message: "Furniture item created successfully",
      data: savedFurniture,
    });
  } catch (error) {
    console.error("Furniture creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}



// @route   GET /api/furniture
// @desc    Get all furniture items
// @access  Public
export async function getAllFurniture(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      subcategory,
      woodType,
      inStock,
      featured,
      search,
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (woodType) query.woodType = woodType;
    if (inStock !== undefined) query.inStock = inStock === "true";
    if (featured !== undefined) query.featured = featured === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const furniture = await Furniture.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Furniture.countDocuments(query);

    res.json({
      success: true,
      data: furniture,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching furniture:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getFurnitureById(req, res) {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture item not found",
      });
    }

    res.json({
      success: true,
      data: furniture,
    });
  } catch (error) {
    console.error("Error fetching furniture by ID:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//Update furniture item
export async function updateFurniture(req, res) {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture item not found",
      });
    }

    // Parse dimensions
    let parsedDimensions = req.body.dimensions;
    if (typeof parsedDimensions === "string") {
      try {
        parsedDimensions = JSON.parse(parsedDimensions);
      } catch (error) {
        console.error("Error parsing dimensions:", error);
        parsedDimensions = furniture.dimensions;
      }
    }

    // Parse tags
    let parsedTags = req.body.tags;
    if (typeof parsedTags === "string") {
      try {
        parsedTags = JSON.parse(parsedTags);
      } catch (error) {
        console.error("Error parsing tags:", error);
        parsedTags = furniture.tags;
      }
    }

    // Images and Models from req.files (from .fields())
    const newImages =
      req.files?.images?.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      })) || [];

    const newModels =
      req.files?.models?.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      })) || [];

    const updateData = {
      name: req.body.name ? req.body.name.trim() : furniture.name,
      category: req.body.category || furniture.category,
      subcategory: req.body.subcategory ?? furniture.subcategory,
      description: req.body.description
        ? req.body.description.trim()
        : furniture.description,
      woodType: req.body.woodType || furniture.woodType,
      dimensions: parsedDimensions || furniture.dimensions,
      tags: parsedTags || furniture.tags,
      price: req.body.price ? parseFloat(req.body.price) : furniture.price,
      salePrice:
        req.body.salePrice !== undefined
          ? req.body.salePrice
            ? parseFloat(req.body.salePrice)
            : null
          : furniture.salePrice,
      stock:
        req.body.stock !== undefined
          ? parseInt(req.body.stock)
          : furniture.stock,
      weight:
        req.body.weight !== undefined
          ? req.body.weight
            ? parseFloat(req.body.weight)
            : null
          : furniture.weight,
      color: req.body.color ?? furniture.color,
      brand: req.body.brand ?? furniture.brand,
      sku: req.body.sku ? req.body.sku.trim() : furniture.sku,
      inStock:
        req.body.inStock !== undefined
          ? req.body.inStock === "true" || req.body.inStock === true
          : furniture.inStock,
      featured:
        req.body.featured !== undefined
          ? req.body.featured === "true" || req.body.featured === true
          : furniture.featured,
    };

    if (newImages.length > 0) {
      updateData.images = [...(furniture.images || []), ...newImages];
    }

    if (newModels.length > 0) {
      updateData.models = [...(furniture.models || []), ...newModels];
    }

    const updatedFurniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Furniture item updated successfully",
      data: updatedFurniture,
    });
  } catch (error) {
    console.error("Error updating furniture:", error);

    // Delete any uploaded files if error occurs
    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//Delete furniture item
export async function deleteFurniture(req, res) {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture item not found",
      });
    }

    if (furniture.images && furniture.images.length > 0) {
      furniture.images.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          "../uploads/furniture-images",
          image.filename
        );
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }

    await Furniture.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Furniture item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting furniture:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//Serve furniture images
export async function serveFurnitureImage(req, res) {
  const filename = req.params.filename;
  const imagePath = path.join(
    __dirname,
    "../uploads/furniture-images",
    filename
  );

  if (fs.existsSync(imagePath)) {
    res.sendFile(path.resolve(imagePath));
  } else {
    res.status(404).json({
      success: false,
      message: "Image not found",
    });
  }
}

//Delete specific image from furniture item
export async function deleteFurnitureImage(req, res) {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture item not found",
      });
    }

    const filename = req.params.filename;

    furniture.images = furniture.images.filter(
      (img) => img.filename !== filename
    );
    await furniture.save();

    const imagePath = path.join(
      __dirname,
      "../uploads/furniture-images",
      filename
    );
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
