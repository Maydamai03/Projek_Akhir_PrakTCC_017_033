function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}

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

const token = localStorage.getItem("token");

if (!token || isTokenExpired(token)) {
  localStorage.removeItem("token");
  location.href = "login.html";
}

const transaksiList = document.getElementById("transaksiList");

function getUserRole() {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

const role = getUserRole();

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
      <table class="transaksi-table">
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
              <td class="status ${trx.status.toLowerCase()}">${trx.status}</td>
              ${role === "admin" ? `
                <td>
                  ${trx.status !== "selesai" 
                    ? `<button class="btn-selesai" onclick="updateStatus(${trx.id}, 'selesai')">Selesai</button>` 
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

fetchTransaksi();
