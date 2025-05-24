// routes/transaksiRoute.js
import express from "express";
import {
  getTransaksi,
  getTransaksiById,
  createTransaksi,
  updateTransaksi,
  deleteTransaksi
} from "../controllers/transaksiController.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/transaksi", verifyToken, getTransaksi);
router.get("/transaksi/:id", verifyToken, getTransaksiById);
router.post("/transaksi", verifyToken, createTransaksi);
router.patch("/transaksi/:id", verifyToken, updateTransaksi);
router.delete("/transaksi/:id", verifyToken, deleteTransaksi);

export default router;