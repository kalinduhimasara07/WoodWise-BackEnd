import Order from "../models/Order.js";

export async function createOrder(req, res) {
  try {
    // Extract the order data from the request body
    const {
      furnitureItems,
      totalAmount,
      advanceAmount,
      customerInfo,
      orderedBy,
      status,
      millWorker,
      notes,
    } = req.body;

    // Generate a unique order number
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 }).limit(1);
    let orderNumber = "ORD001"; // Default order number

    if (lastOrder) {
      const lastOrderNumber = parseInt(
        lastOrder.orderNumber.replace("ORD", "")
      );
      orderNumber = `ORD${(lastOrderNumber + 1).toString().padStart(3, "0")}`;
    }

    // Create a new order instance
    const newOrder = new Order({
      orderNumber,
      furnitureItems,
      totalAmount,
      advanceAmount,
      customerInfo,
      orderedBy: orderedBy || "Store Manager", // Default value if not provided
      status: status || "Pending", // Default value if not provided
      millWorker: millWorker || "Not Assigned", // Default value if not provided
      notes: notes || "No additional notes", // Default value if not provided
    });

    // Save the new order to the database
    await newOrder.save();

    // Send a success response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
