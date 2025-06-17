import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import furnitureRouter from "./routes/furnitureRouter.js";
import dotenv from "dotenv";
dotenv.config();
// const { default: userRouter } = require("./routes/userRouter.js");
// const { default: furnitureRouter } = require("./routes/furnitureRouter.js");
// require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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

app.use("/api/auth", userRouter);
app.use("/api/furniture", furnitureRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
