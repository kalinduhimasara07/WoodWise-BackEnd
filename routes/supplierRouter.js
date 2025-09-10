import express from "express";
import { addSupplier, getAllSuppliers } from "../controllers/suppliersController.js";


const supplierRouter = express.Router();

supplierRouter.post("/", addSupplier);
supplierRouter.get("/", getAllSuppliers);


export default supplierRouter;
