const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

const urlParams = new URLSearchParams(window.location.search);
const rumahId = urlParams.get("id");
const detailDiv = document.getElementById("detailRumah");
const btnBeli = document.getElementById("btnBeli");

async function fetchRumah() {
  try {
    const res = await fetch(`http://localhost:5000/rumah/${rumahId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Rumah tidak ditemukan");
    const rumah = await res.json();

    detailDiv.innerHTML = `
      <h2>${rumah.nama}</h2>
      ${rumah.gambar ? `<img src="http://localhost:5000/uploads/${rumah.gambar}" alt="${rumah.nama}"/>` : ""}
      <p>Lokasi: ${rumah.lokasi}</p>
      <p>Harga: Rp${rumah.harga.toLocaleString()}</p>
      <p>${rumah.deskripsi}</p>
    `;
  } catch (error) {
    alert(error.message);
    location.href = "index.html";
  }
}

btnBeli.addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:5000/transaksi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rumahId })
    });

    if (!res.ok) throw new Error("Gagal membuat transaksi");

    alert("Transaksi berhasil dibuat, menunggu konfirmasi");
    location.href = "./transaksi.html";
  } catch (err) {
    alert(err.message);
  }
});

fetchRumah();
