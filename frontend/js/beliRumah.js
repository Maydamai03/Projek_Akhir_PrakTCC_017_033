const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

const transaksiLink = document.getElementById("link-transaksi");
const tambahRumahLink = document.getElementById("link-tambah-rumah");
const gambarDiv = document.getElementById("gambarRumah");
const dataDiv = document.getElementById("dataRumah");
const deskripsiDiv = document.getElementById("deskripsiRumah");
const btnBeli = document.getElementById("btnBeli");
const popupContainer = document.getElementById("popupContainer");

const urlParams = new URLSearchParams(window.location.search);
const rumahId = urlParams.get("id");

let role = "user";
try {
  const payload = JSON.parse(atob(token.split('.')[1]));
  role = payload.role || 'user';
  const email = payload.email || 'pengguna';
  const authInfo = document.getElementById("auth-info");

  authInfo.innerText = `Hai, ${email}`;
  if (transaksiLink) transaksiLink.style.display = "inline-block";
  if (role === "admin") {
    if (tambahRumahLink) tambahRumahLink.style.display = "inline-block";
  } else {
    if (tambahRumahLink) tambahRumahLink.style.display = "none";
  }
} catch (err) {
  console.error("Gagal parsing token:", err);
  alert("Token tidak valid, silakan login kembali.");
  location.href = "login.html";
}

async function fetchRumah() {
  try {
    const res = await fetch(`http://localhost:5000/rumah/${rumahId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Rumah tidak ditemukan");

    const rumah = await res.json();
    const imageUrl = rumah.gambar
      ? `http://localhost:5000/uploads/${rumah.gambar}`
      : 'image/default.avif';

    gambarDiv.innerHTML = `<img src="${imageUrl}" alt="${rumah.nama}" />`;
    dataDiv.innerHTML = `
      <h2>${rumah.nama}</h2>
      <p><strong>Lokasi:</strong> ${rumah.lokasi}</p>
      <p><strong>Harga:</strong> Rp${Number(rumah.harga).toLocaleString()}</p>
    `;
    deskripsiDiv.innerHTML = `
      <p><strong>Deskripsi Lengkap: <br></strong>${rumah.deskripsi}</p>
    `;

    // Tambahkan tombol Hubungi Admin setelah rumah ditampilkan
    const buttonContainer = document.querySelector(".button-container");
    const hubungiBtn = document.createElement("a");
    hubungiBtn.href = "https://www.instagram.com/wahyu_vr311?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
    hubungiBtn.innerText = "Hubungi Admin";
    hubungiBtn.target = "_blank";
    hubungiBtn.id = "btnHubungi";
    buttonContainer.appendChild(hubungiBtn);
  } catch (error) {
    alert(error.message);
    location.href = "index.html";
  }
}

btnBeli.addEventListener("click", () => {
  showConfirmPopup();
});

function showConfirmPopup() {
  popupContainer.innerHTML = `
    <div id="popupConfirm">
      <div class="modal-content">
        <p>Yakin ingin membeli rumah ini?</p>
        <button id="confirmYes">Ya, Beli</button>
        <button id="confirmCancel">Batal</button>
      </div>
    </div>
  `;

  const popup = document.getElementById("popupConfirm");
  const yesBtn = document.getElementById("confirmYes");
  const cancelBtn = document.getElementById("confirmCancel");

  yesBtn.addEventListener("click", async () => {
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

  cancelBtn.addEventListener("click", () => {
    popup.classList.add("fade-out");
    setTimeout(() => popup.remove(), 300);
  });
}

fetchRumah();

function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}
