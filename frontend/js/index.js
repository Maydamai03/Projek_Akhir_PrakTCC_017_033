const token = localStorage.getItem("token");
const rumahList = document.getElementById("rumah-list");
const authInfo = document.getElementById("auth-info");
const btnTambah = document.getElementById("btnTambah");
const btnTransaksi = document.getElementById("btnTransaksi");

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

        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        authInfo.innerText = `Login sebagai: ${payload.email} (${role})`;

        if (role === "admin") {
            btnTambah.style.display = "inline";
            btnTransaksi.style.display = "inline";
        }

        rumahList.innerHTML = "";
        data.forEach(rumah => {
            const div = document.createElement("div");
            div.className = "rumah";
            div.innerHTML = `
                <h3>${rumah.nama}</h3>
                ${rumah.gambar ? `<img src="http://localhost:5000/uploads/${rumah.gambar}" alt="${rumah.nama}" />` : ''}
                <p>Lokasi: ${rumah.lokasi}</p>
                <p>Harga: Rp${rumah.harga.toLocaleString()}</p>
                <p>${rumah.deskripsi}</p>
                ${role === "user" ? `<a href="beliRumah.html?id=${rumah.id}"><button>Beli</button></a>` : ""}
                ${role === "admin" ? `<button onclick="hapus(${rumah.id})">Hapus</button>` : ""}
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

async function beli(id) {
    try {
        await fetch("http://localhost:5000/transaksi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ rumahId: id })
        });
        alert("Transaksi berhasil dibuat");
        location.href = "./transaksi.html";
    } catch (err) {
        alert("Gagal melakukan transaksi");
    }
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
