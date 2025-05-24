import express from "express";
import multer from "multer";
import path from "path";
import {
    getRumah,
    getRumahById,
    createRumah,
    updateRumah,
    deleteRumah
} from "../controllers/rumahController.js";

import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// Setup storage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");  // folder tempat simpan gambar
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nama file unik
  }
});
const upload = multer({ storage });

// Routes
router.post("/rumah", verifyToken, verifyAdmin, upload.single("gambar"), createRumah);
router.get('/rumah', verifyToken, getRumah);
router.get('/rumah/:id', verifyToken, getRumahById); // << ini yang kurang
router.patch('/rumah/:id', verifyToken, upload.single("gambar"), updateRumah);
router.delete('/rumah/:id', verifyToken, deleteRumah);


export default router;
