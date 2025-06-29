import express from "express";
import {
  loginUser,
  RegisterUser,
  getAllUser,
} from "v1/controllers/user.controller";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", loginUser);
router.get("/",getAllUser)
export default router;
