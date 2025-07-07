import app from "../dist/server.js"; // compiled JS file
import { createServer } from "http";

export default function handler(req, res) {
  const server = createServer(app);
  server.emit("request", req, res);
}
