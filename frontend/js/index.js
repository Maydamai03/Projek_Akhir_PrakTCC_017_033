const token = localStorage.getItem("token");
const rumahList = document.getElementById("rumah-list");
const authInfo = document.getElementById("auth-info");
const adminLinks = document.getElementById("admin-links");

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
        const email = payload.email || 'pengguna';

        // Tampilkan info login
        authInfo.innerText = `Hai, ${email}`;

        // Tampilkan menu admin di navbar tengah jika admin
        if (role === "admin" && adminLinks) {
            adminLinks.style.display = "flex";
        }

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
                ${role === "user" ? `<a href="beliRumah.html?id=${rumah.id}"><button>Beli</button></a>` : ""}
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
