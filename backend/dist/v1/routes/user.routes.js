"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("v1/controllers/user.controller");
const multer_middleware_1 = __importDefault(require("../../middlewares/multer.middleware"));
const router = express_1.default.Router();
router.post("/register", user_controller_1.RegisterUser);
router.post("/login", user_controller_1.loginUser);
router.get("/", user_controller_1.getAllUser);
router.patch("/:id", multer_middleware_1.default.single("file"), user_controller_1.updateById);
router.get("/:id", user_controller_1.getUserById);
exports.default = router;
