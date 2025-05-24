import Transaksi from "../models/transaksiModel.js";
import Rumah from "../models/rumahModel.js";
import Auth from "../models/authModel.js";

export const getTransaksi = async (req, res) => {
  try {
    const transaksi = req.role === "admin"
      ? await Transaksi.findAll({ include: [Auth, Rumah] })
      : await Transaksi.findAll({ where: { userId: req.userId }, include: [Auth, Rumah] });
    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
};

export const getTransaksiById = async (req, res) => {
  try {
    const transaksi = await Transaksi.findOne({
      where: { id: req.params.id },
      include: [Auth, Rumah]
    });
    if (!transaksi) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    if (req.role !== 'admin' && transaksi.userId !== req.userId) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransaksi = async (req, res) => {
  try {
    const newTransaksi = await Transaksi.create({
      userId: req.userId,
      rumahId: req.body.rumahId,
      status: "menunggu konfirmasi"
    });
    res.status(201).json(newTransaksi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findOne({ where: { id: req.params.id } });
    if (!transaksi) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    if (req.role !== 'admin' && transaksi.userId !== req.userId) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    await transaksi.update(req.body);
    res.json({ message: "Transaksi berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findOne({ where: { id: req.params.id } });
    if (!transaksi) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    if (req.role !== 'admin' && transaksi.userId !== req.userId) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    await transaksi.destroy();
    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
