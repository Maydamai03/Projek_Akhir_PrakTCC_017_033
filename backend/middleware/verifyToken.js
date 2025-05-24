import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: "Tidak ada token, akses ditolak" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Token tidak valid" });

    req.userId = decoded.id;
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ msg: "Akses hanya untuk admin" });
  }
  next();
};
