import Auth from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await Auth.create({
      name,
      email,
      password: hash,
      role: role || "user"
    });
    res.status(201).json({ msg: "Akun berhasil dibuat" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Auth.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: "Password salah" });

    // buat token
    const accessToken = jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role     // kalau kamu pakai role
}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d'
});


    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
