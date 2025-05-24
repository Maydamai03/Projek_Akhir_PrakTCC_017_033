// Ambil token dulu
const token = localStorage.getItem("token");

// Fungsi cek token expired
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now > exp;
  } catch {
    return true;
  }
}

// Redirect kalau token tidak ada atau expired
if (!token || isTokenExpired(token)) {
  localStorage.removeItem("token");
  location.href = "login.html";
}

// Deklarasi elemen navbar dan auth-info
const linkTambahRumah = document.getElementById("link-tambah-rumah");
const linkTransaksi = document.getElementById("link-transaksi");
const authInfo = document.getElementById("auth-info");

// Ambil payload dari token
let role = "user";
let email = "pengguna";

try {
  const payload = JSON.parse(atob(token.split('.')[1]));
  role = payload.role || "user";
  email = payload.email || "pengguna";
} catch {
  // Kalau error parsing token, tetap role dan email default
}

// Update tampilan navbar sesuai role
if (role === "admin") {
  if (linkTambahRumah) linkTambahRumah.style.display = "inline-block";
  if (linkTransaksi) linkTransaksi.style.display = "inline-block";
} else {
  if (linkTambahRumah) linkTambahRumah.style.display = "none";
  if (linkTransaksi) linkTransaksi.style.display = "inline-block"; // user biasa tetap bisa akses transaksi (kalau memang iya)
}

// Update greeting user
if (authInfo) {
  authInfo.innerText = `Hai, ${email}`;
}

// Ambil elemen tabel transaksi
const transaksiList = document.getElementById("transaksiList");

// Fungsi ambil data transaksi dan render ke tabel
async function fetchTransaksi() {
  try {
    const res = await fetch("http://localhost:5000/transaksi", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401 || res.status === 403) {
      alert("Sesi habis. Silakan login ulang.");
      localStorage.removeItem("token");
      location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error("Gagal mengambil data transaksi");

    const data = await res.json();

    transaksiList.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Rumah</th>
            <th>Status</th>
            ${role === "admin" ? "<th>Aksi</th>" : ""}
          </tr>
        </thead>
        <tbody>
          ${data.map(trx => `
            <tr>
              <td>${trx.id}</td>
              <td>${trx.rumah?.nama || 'Tanpa Nama'}</td>
              <td class="${trx.status === "selesai" ? "status-selesai" : "status-menunggu"}">
                <i class="fas ${trx.status === "selesai" ? "fa-check-circle" : "fa-clock"}"></i>
                ${trx.status}
              </td>
              ${role === "admin" ? `
                <td>
                  ${trx.status !== "selesai" 
                    ? `<button onclick="updateStatus(${trx.id}, 'selesai')">Selesai</button>` 
                    : "-"}
                </td>
              ` : ""}
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

  } catch (error) {
    alert(error.message);
  }
}

// Fungsi update status transaksi (hanya admin)
async function updateStatus(id, status) {
  if (!confirm("Update status transaksi?")) return;
  try {
    const res = await fetch(`http://localhost:5000/transaksi/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (res.status === 401 || res.status === 403) {
      alert("Sesi habis. Silakan login ulang.");
      localStorage.removeItem("token");
      location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error("Gagal update status");
    alert("Status transaksi diperbarui");
    fetchTransaksi();
  } catch (err) {
    alert(err.message);
  }
}

// Panggil fungsi ambil transaksi saat halaman load
fetchTransaksi();

// Fungsi logout (bila ada tombol logout)
function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}
