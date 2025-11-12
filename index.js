import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import furnitureRouter from "./routes/furnitureRouter.js";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import timberRouter from "./routes/timberRouter.js";
import orderRouter from "./routes/orderRouter.js";
import messageRouter from "./routes/messageRouter.js";
import Jwt from "jsonwebtoken";
import supplierRouter from "./routes/supplierRouter.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://wood-wise-xi.vercel.app/",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use((req, res, next) => {
  const tokenString = req.header("Authorization");
  if (tokenString != null) {
    const token = tokenString.replace("Bearer ", "");
    Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded != null) {
        // console.log(decoded);
        req.user = decoded;
        next();
      } else {
        console.log("invalid token");
        res.status(403).json({ error: "Invalid token" });
      }
    });
    // console.log(token);
  } else {
    next();
  }
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    auth: {
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
    },
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/uploads", express.static("uploads"));

const imageDir = "uploads/furniture-images";
const modelDir = "uploads/furniture-models";

if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
if (!fs.existsSync(modelDir)) fs.mkdirSync(modelDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "images") {
      cb(null, imageDir);
    } else if (file.fieldname === "models") {
      cb(null, modelDir);
    } else {
      cb(new Error("Invalid file field name"), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
}).fields([
  { name: "images", maxCount: 10 },
  { name: "models", maxCount: 5 },
]);

app.use("/api/auth", userRouter);

app.post("/api/furniture/add-furniture", upload, furnitureRouter);

app.use("/api/furniture", furnitureRouter);

app.use("/api/timber", timberRouter);

app.use("/api/orders", orderRouter);

app.use("/api/messages", messageRouter);

app.use("/api/suppliers", supplierRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
