import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Auth from "./authModel.js";
import Rumah from "./rumahModel.js";

const { DataTypes } = Sequelize;

const Transaksi = db.define("transaksi", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rumahId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "menunggu konfirmasi"
  }
}, {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false
});

// RELASI YANG JELAS DAN SESUAI DENGAN NAMA
Auth.hasMany(Transaksi, { foreignKey: "userId" });
Transaksi.belongsTo(Auth, { foreignKey: "userId" });

Rumah.hasMany(Transaksi, { foreignKey: "rumahId" });
Transaksi.belongsTo(Rumah, { foreignKey: "rumahId" });

export default Transaksi;

(async () => {
  await db.sync();
})();
