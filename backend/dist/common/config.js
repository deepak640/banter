"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.CONFIG = {
    PORT: (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000,
    MONGO_URI: (_b = process.env.MONGO_URI) !== null && _b !== void 0 ? _b : "",
    JWT_SECRET: (_c = process.env.JWT_SECRET) !== null && _c !== void 0 ? _c : "qwertyuiop",
};
