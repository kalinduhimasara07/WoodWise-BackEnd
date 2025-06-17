import express from "express";
import {
  addFurniture,
  deleteFurniture,
  deleteFurnitureImage,
  getAllFurniture,
  getFurnitureById,
  serveFurnitureImage,
  updateFurniture,
} from "../controllers/furnitureController.js";

const furnitureRouter = express.Router();

furnitureRouter.post("/add-furniture", addFurniture);
furnitureRouter.get("/", getAllFurniture);
furnitureRouter.get("/:id", getFurnitureById);
furnitureRouter.put("/:id", updateFurniture);
furnitureRouter.delete("/:id", deleteFurniture);
furnitureRouter.get("/images/:filename", serveFurnitureImage);
furnitureRouter.delete("/:id/images/:filename", deleteFurnitureImage);

export default furnitureRouter;
