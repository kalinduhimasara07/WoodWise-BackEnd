import express from "express";
import { addTimber, getAllTimber, updateTimber } from "../controllers/timberController.js";

const timberRouter = express.Router();

timberRouter.post("/", addTimber);
timberRouter.get("/", getAllTimber);
timberRouter.put("/:id", updateTimber);

export default timberRouter;
