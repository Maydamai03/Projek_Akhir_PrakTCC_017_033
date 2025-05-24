import Transaksi from "../models/transaksiModel.js";
import Rumah from "../models/rumahModel.js";
import { Sequelize } from "sequelize";

export const getRumah = async (req, res) => {
  try {
    const rumah = await Rumah.findAll({
      where: {
        id: {
          [Sequelize.Op.notIn]: Sequelize.literal(`(
            SELECT rumahId FROM transaksi WHERE status = 'selesai'
          )`)
        }
      }
    });
    res.json(rumah);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getRumahById = async (req, res) => {
  try {
    const rumah = await Rumah.findOne({ where: { id: req.params.id } });
    if (!rumah) return res.status(404).json({ message: "Rumah tidak ditemukan" });
    res.json(rumah);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRumah = async (req, res) => {
  try {
    const gambar = req.file ? req.file.filename : null;

    await Rumah.create({ ...req.body, userId: req.userId, gambar });
    res.status(201).json({ message: "Rumah berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRumah = async (req, res) => {
  try {
    const rumah = await Rumah.findOne({ where: { id: req.params.id } });
    if (!rumah) return res.status(404).json({ message: "Rumah tidak ditemukan" });
    if (req.role !== 'admin' && rumah.userId !== req.userId) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    // Update data dari req.body
    const dataUpdate = { ...req.body };

    // Jika ada file gambar baru, update kolom gambar
    if (req.file) {
      dataUpdate.gambar = req.file.filename;
    }

    await rumah.update(dataUpdate);
    res.json({ message: "Rumah berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteRumah = async (req, res) => {
  try {
    const rumah = await Rumah.findOne({ where: { id: req.params.id } });
    if (!rumah) return res.status(404).json({ message: "Rumah tidak ditemukan" });
    if (req.role !== 'admin' && rumah.userId !== req.userId) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    await rumah.destroy();
    res.json({ message: "Rumah berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};