import express from "express";
import {
  deleteUser,
  getAllUsers,
  getuser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.get("/", getAllUsers);
userRouter.delete("/:id", deleteUser);
userRouter.get("/user", getuser);

export default userRouter;
