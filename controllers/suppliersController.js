import Supplier from "../models/Suppliers.js";

export async function addSupplier(req, res) {
  try {
    const {
      name,
      companyName,
      contactPerson,
      contactNumber,
      email,
      address,
      rating,
      active,
    } = req.body;

    const supplier = new Supplier({
      name,
      companyName,
      contactPerson,
      contactNumber,
      email,
      address,
      rating,
      active,
    });

    await supplier.save();

    res.status(201).json({
      success: true,
      message: "Supplier added successfully",
      data: supplier,
    });
  } catch (error) {
    console.error("Error adding supplier:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// Get all suppliers
export async function getAllSuppliers(req, res) {
  try {
    // Fetch all suppliers (you can also add filters later if needed)
    const suppliers = await Supplier.find();

    res.status(200).json({
      success: true,
      message: "Suppliers fetched successfully",
      data: suppliers,
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update a supplier
export async function updateSupplier(req, res) {
  try {
    const { id } = req.params;

    // { new: true } returns the updated document
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: updatedSupplier,
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete a supplier
export async function deleteSupplier(req, res) {
  try {
    const { id } = req.params;

    const deletedSupplier = await Supplier.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
      data: deletedSupplier,
    });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
