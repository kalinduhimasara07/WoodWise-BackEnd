import Timber from "../models/Timber.js";

export async function addTimber(req, res) {
  try {
    // Extract timber data from the request body
    const {
      category,
      grade,
      pricePerUnit,
      description,
      dimensions,
      stock,
      sku,
    } = req.body;

    // Create a new Timber document with the provided data
    const timber = new Timber({
      category,
      grade,
      pricePerUnit,
      description,
      dimensions,
      stock,
      sku,
    });

    // Save the new timber item to the database
    await timber.save();

    res.status(201).json({
      success: true,
      message: "Timber item added successfully",
      data: timber,
    });
  } catch (error) {
    console.error("Error adding timber:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllTimber(req, res) {
  try {
    // Retrieve all timber items from the database
    const timbers = await Timber.find();

    if (timbers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No timber items found",
      });
    }

    // Send the list of timbers in the response
    res.json({
      success: true,
      message: "Timber items retrieved successfully",
      data: timbers,
    });
  } catch (error) {
    console.error("Error retrieving timber items:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateTimber(req, res) {
  try {
    const timberId = req.params.id; // Get the timber ID from the request parameters
    const updateData = req.body; // Get the data to update from the request body

    // Find the timber item by its ID
    const timber = await Timber.findById(timberId);

    // If the timber item does not exist, return a 404 error
    if (!timber) {
      return res.status(404).json({
        success: false,
        message: "Timber item not found",
      });
    }

    // Update the timber item with the new data
    const updatedTimber = await Timber.findByIdAndUpdate(timberId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run validation before saving the document
    });

    // Return a success response with the updated timber item
    res.json({
      success: true,
      message: "Timber item updated successfully",
      data: updatedTimber,
    });
  } catch (error) {
    console.error("Error updating timber:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
