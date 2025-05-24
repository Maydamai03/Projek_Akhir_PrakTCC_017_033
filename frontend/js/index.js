const token = localStorage.getItem("token");
const rumahList = document.getElementById("rumah-list");
const authInfo = document.getElementById("auth-info");
const transaksiLink = document.getElementById("link-transaksi");
const tambahRumahLink = document.getElementById("link-tambah-rumah");

if (!token) {
    location.href = "login.html";
}

async function fetchRumah() {
    try {
        const res = await fetch("http://localhost:5000/rumah", {
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

        // Tampilkan info login
        authInfo.innerText = `Hai, ${email}`;

        // Tampilkan opsi Transaksi untuk semua user
        if (transaksiLink) transaksiLink.style.display = "inline-block";

        // Tampilkan opsi Tambah Rumah hanya untuk admin
        if (role === "admin") {
            if (tambahRumahLink) tambahRumahLink.style.display = "inline-block";
        } else {
            if (tambahRumahLink) tambahRumahLink.style.display = "none";
        }

        // Bersihkan list rumah dulu
        rumahList.innerHTML = "";

        data.forEach(rumah => {
            const div = document.createElement("div");
            div.className = "rumah";
            div.innerHTML = `
                <h3>${rumah.nama}</h3>
                ${rumah.gambar ? `<img src="http://localhost:5000/uploads/${rumah.gambar}" alt="${rumah.nama}" />` : '<img src="default.jpg" alt="No Image" />'}
                <p>Lokasi: ${rumah.lokasi}</p>
                <p>Harga: Rp${rumah.harga.toLocaleString()}</p>
                <p>${rumah.deskripsi}</p>
                ${role === "user" ? `
                    <button class="beli" onclick="location.href='beliRumah.html?id=${rumah.id}'">Beli</button>
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
