"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const server_1 = __importDefault(require("../server"));
const http_1 = require("http");
function handler(req, res) {
    const server = (0, http_1.createServer)(server_1.default);
    server.emit("request", req, res);
}
