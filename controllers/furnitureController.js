import path from "path";
import fs from "fs";
import Furniture from "../models/Furniture.js";

//handle adding furniture
export async function addFurniture(req, res) {
  try {
    console.log("Request Body:", req.body);
    console.log("Files:", req.files);

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
      featured,
    } = req.body;

    if (
      !name ||
      !category ||
      !price ||
      !description ||
      !woodType ||
      !stock ||
      !sku
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    const parsedDimensions = dimensions ? JSON.parse(dimensions) : {};
    const parsedTags = tags ? JSON.parse(tags) : [];

    // Handle images - Ensure images is an array before processing
    const imageData = Array.isArray(req.body.images)
      ? req.body.images.map((url) => ({ url }))
      : req.body.images
      ? [{ url: req.body.images }]
      : [];

    // Handle models - Ensure it's an array before processing
    const modelData = req.body.models
      ? Array.isArray(req.body.models)
        ? req.body.models.map((url) => ({ url }))
        : [{ url: req.body.models }] 
      : [];

    // Create the new furniture item
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
      images: imageData,
      models: modelData,
      inStock: inStock === "true" || inStock === true,
      featured: featured === "true" || featured === true,
    });

    // Save the furniture item in the database
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

export async function getAllFurniture(req, res) {
  try {
    const {
      page = 1,
      limit = 50,
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
    const furniture = await Furniture.findOne({ sku: req.params.id });

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

export async function updateFurniture(req, res) {
  try {
    const furniture = await Furniture.findOne({ sku: req.params.id });

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture item not found",
      });
    }

    const updatedFurniture = await Furniture.findOneAndUpdate(
      { sku: req.params.id },
      {
        name: req.body.name || furniture.name,
        category: req.body.category || furniture.category,
        subcategory: req.body.subcategory || furniture.subcategory,
        description: req.body.description || furniture.description,
        woodType: req.body.woodType || furniture.woodType,
        dimensions: req.body.dimensions || furniture.dimensions,
        tags: req.body.tags || furniture.tags,
        price: req.body.price || furniture.price,
        images: req.body.images
          ? Array.isArray(req.body.images)
            ? req.body.images.map((image) => ({
                url: image.url,
                size: image.size,
                uploadDate: image.uploadDate || Date.now(),
              }))
            : req.body.images
          : furniture.images,
        models: req.body.models
          ? Array.isArray(req.body.models)
            ? req.body.models.map((model) => ({
                url: model.url,
                size: model.size,
                uploadDate: model.uploadDate || Date.now(),
              }))
            : req.body.models
          : furniture.models,
        salePrice: req.body.salePrice || furniture.salePrice,
        stock: req.body.stock || furniture.stock,
        weight: req.body.weight || furniture.weight,
        color: req.body.color || furniture.color,
        brand: req.body.brand || furniture.brand,
        sku: req.body.sku || furniture.sku,
        inStock: req.body.inStock || furniture.inStock,
        featured: req.body.featured || furniture.featured,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Furniture item updated successfully",
      data: updatedFurniture,
    });
  } catch (error) {
    console.error("Error updating furniture:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
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
