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

// Add the route to add furniture and apply multer middleware
furnitureRouter.post("/add-furniture", addFurniture);  // Multer middleware is already applied in index.js

furnitureRouter.get("/", getAllFurniture);
furnitureRouter.get("/:id", getFurnitureById);
furnitureRouter.put("/:id", updateFurniture);
furnitureRouter.delete("/:id", deleteFurniture);
furnitureRouter.get("/images/:filename", serveFurnitureImage);
furnitureRouter.delete("/:id/images/:filename", deleteFurnitureImage);

export default furnitureRouter;
