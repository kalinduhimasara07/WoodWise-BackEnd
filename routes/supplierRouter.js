import express from "express";
import { addSupplier, getAllSuppliers, updateSupplier, deleteSupplier } from "../controllers/suppliersController.js";


const supplierRouter = express.Router();

supplierRouter.post("/", addSupplier);
supplierRouter.get("/", getAllSuppliers);
supplierRouter.put("/:id", updateSupplier);
supplierRouter.delete("/:id", deleteSupplier);

export default supplierRouter;
