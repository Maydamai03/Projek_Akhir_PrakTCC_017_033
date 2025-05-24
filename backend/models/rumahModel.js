import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Rumah = db.define('rumah', {
  nama: DataTypes.STRING,
  lokasi: DataTypes.STRING,
  harga: DataTypes.INTEGER,
  deskripsi: DataTypes.TEXT,
  gambar: {                    // tambah kolom gambar
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Rumah;

(async () => {
  await db.sync({ alter: true });  // sync dengan alter supaya kolom baru ditambahkan
})();
