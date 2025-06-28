import express from "express";
import {
  addTimber,
  deleteTimber,
  getAllTimber,
  updateTimber,
} from "../controllers/timberController.js";

const timberRouter = express.Router();

timberRouter.post("/", addTimber);
timberRouter.get("/", getAllTimber);
timberRouter.put("/:id", updateTimber);
timberRouter.delete("/:id", deleteTimber);

export default timberRouter;
