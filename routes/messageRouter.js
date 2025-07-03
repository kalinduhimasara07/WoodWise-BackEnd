import express from "express";
import {
  getAllMessages,
  markMessageAsRead,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/", sendMessage);
messageRouter.put("/read", markMessageAsRead);
messageRouter.get("/", getAllMessages);

export default messageRouter;
