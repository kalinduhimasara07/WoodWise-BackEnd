import Timber from "../models/Timber.js";

export async function addTimber(req, res) {
  try {
    const {
      category,
      grade,
      pricePerUnit,
      description,
      dimensions,
      stock,
      sku,
    } = req.body;

    const timber = new Timber({
      category,
      grade,
      pricePerUnit,
      description,
      dimensions,
      stock,
      sku,
    });

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
    const timbers = await Timber.find();

    if (timbers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No timber items found",
      });
    }

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
    const timberId = req.params.id;
    const updateData = req.body;

    const timber = await Timber.findById(timberId);

    if (!timber) {
      return res.status(404).json({
        success: false,
        message: "Timber item not found",
      });
    }

    const updatedTimber = await Timber.findByIdAndUpdate(timberId, updateData, {
      new: true,
      runValidators: true,
    });

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


export async function deleteTimber(req, res) {
  try {
    const timberId = req.params.id;

    const timber = await Timber.findById(timberId);

    if (!timber) {
      return res.status(404).json({
        success: false,
        message: "Timber item not found",
      });
    }

    await Timber.findByIdAndDelete(timberId);

    res.json({
      success: true,
      message: "Timber item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting timber:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

