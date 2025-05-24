const token = localStorage.getItem("token");
const rumahList = document.getElementById("rumah-list");
const authInfo = document.getElementById("auth-info");
const transaksiLink = document.getElementById("link-transaksi");
const tambahRumahLink = document.getElementById("link-tambah-rumah");

if (!token) {
    location.href = "login.html";
}

async function fetchRumah() {
  const nama = document.getElementById("search-nama")?.value || "";
  const lokasi = document.getElementById("search-lokasi")?.value || "";
  const hargaMax = document.getElementById("search-harga")?.value || "";

  const query = new URLSearchParams();
  if (nama) query.append("nama", nama);
  if (lokasi) query.append("lokasi", lokasi);
  if (hargaMax) query.append("hargaMax", hargaMax);

  try {
    const res = await fetch(`http://localhost:5000/rumah?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Token tidak valid");
    const data = await res.json();

    // Ambil payload dari token
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role || 'user';
    const email = payload.email || 'pengguna';

    authInfo.innerText = `Hai, ${email}`;
    if (transaksiLink) transaksiLink.style.display = "inline-block";
    if (role === "admin") {
      if (tambahRumahLink) tambahRumahLink.style.display = "inline-block";
    } else {
      if (tambahRumahLink) tambahRumahLink.style.display = "none";
    }

    rumahList.innerHTML = "";

    if (data.length === 0) {
      rumahList.innerHTML = "<p>Tidak ada rumah ditemukan.</p>";
      return;
    }

    data.forEach(rumah => {
      const div = document.createElement("div");
      div.className = "rumah";
      div.innerHTML = `
        <h3>${rumah.nama}</h3>
        ${rumah.gambar ? `<img src="http://localhost:5000/uploads/${rumah.gambar}" alt="${rumah.nama}" />` : '<img src="default.jpg" alt="No Image" />'}
        <p>Lokasi: ${rumah.lokasi}</p>
        <p>Harga: Rp${rumah.harga.toLocaleString()}</p>

        ${role === "user" ? `
          <button class="beli" onclick="location.href='beliRumah.html?id=${rumah.id}'">Tinjau Rumah</button>
        ` : ""}
        ${role === "admin" ? `
          <button class="edit" onclick="location.href='formRumah.html?id=${rumah.id}'">Edit</button>
          <button class="delete" onclick="hapus(${rumah.id})">Hapus</button>
        ` : ""}
      `;
      rumahList.appendChild(div);
    });

  } catch (err) {
    alert("Sesi habis, silakan login ulang");
    localStorage.removeItem("token");
    location.href = "login.html";
  }
}


function logout() {
    localStorage.removeItem("token");
    location.href = "login.html";
}

async function hapus(id) {
    if (!confirm("Yakin ingin menghapus rumah ini?")) return;
    try {
        await fetch(`http://localhost:5000/rumah/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        alert("Rumah berhasil dihapus");
        fetchRumah();
    } catch (err) {
        alert("Gagal menghapus rumah");
    }
}

fetchRumah();
