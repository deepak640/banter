import express from "express";
import {
  loginUser,
  RegisterUser,
  getAllUser,
  updateById,
  getUserById,
} from "v1/controllers/user.controller";
import upload from "../../middlewares/multer.middleware";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", loginUser);
router.get("/", getAllUser);
router.patch("/:id", upload.single("file"), updateById);
router.get("/:id", getUserById);
export default router;
