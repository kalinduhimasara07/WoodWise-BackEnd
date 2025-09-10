import Supplier from "../models/Suppliers.js"; // adjust the path if needed

export async function addSupplier(req, res) {
  try {
    // Extract supplier data from request body
    const {
      name,
      companyName,
      contactPerson,
      contactNumber,
      email,
      address,
      supplies, // array of supplied timbers
      rating,
      active,
    } = req.body;

    // Create a new Supplier document
    const supplier = new Supplier({
      name,
      companyName,
      contactPerson,
      contactNumber,
      email,
      address,
      supplies,  // [{ timberCategory, grade, pricePerUnit, stockAvailable, description }]
      rating,
      active,
    });

    // Save supplier to DB
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
