import express, { Request, Response } from "express";
import upload from "middlewares/multer.middleware";
const router = express.Router();

// Routes
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is running successfully",
    status: "OK",
  });
});

router.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const fileUrl = `${process.env.APP_URL}/public/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;
