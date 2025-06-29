import express from "express";
import {
  changeOrderStatus,
  changePaymentComplete,
  createOrder,
  getAllOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getAllOrders);
orderRouter.put("/status", changeOrderStatus);
orderRouter.put("/payment-status", changePaymentComplete);

export default orderRouter;
