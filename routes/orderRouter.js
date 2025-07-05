import express from "express";
import {
  changeOrderStatus,
  changePaymentComplete,
  createOrder,
  getAllOrders,
  sendOrderConfirmation,
  updateOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getAllOrders);
orderRouter.put("/status", changeOrderStatus);
orderRouter.put("/payment-status", changePaymentComplete);
orderRouter.put("/update", updateOrder);
orderRouter.post("/send-sms", sendOrderConfirmation);

export default orderRouter;
