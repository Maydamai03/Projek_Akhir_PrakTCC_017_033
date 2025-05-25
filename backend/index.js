import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import RumahRoute from "./routes/rumahRoute.js";
import "./models/rumahModel.js";
import TransaksiRoute from "./routes/transaksiRoute.js";
import "./models/transaksiModel.js";
import AuthRoutes from "./routes/authRoute.js";
import "./models/authModel.js";

dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: 'https://fe-projekakhir-17-33-dot-projekcc017033.uc.r.appspot.com/' }));
app.use(cookieParser());
app.use(express.json());

// **Tambahkan baris ini agar folder uploads bisa diakses secara statis**
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.use(TransaksiRoute);
app.use(AuthRoutes);
app.use(RumahRoute);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
