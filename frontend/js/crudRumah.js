const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

const form = document.getElementById("formRumah");
const title = document.getElementById("form-title");
const urlParams = new URLSearchParams(window.location.search);
const rumahId = urlParams.get("id");
const isEdit = Boolean(rumahId);
const authInfo = document.getElementById("auth-info");

// ambil email dari token
const payload = JSON.parse(atob(token.split('.')[1]));
const email = payload.email || 'pengguna';
const role = payload.role;

const adminLinks = document.getElementById("admin-links");
if (role === "admin" && adminLinks) {
    adminLinks.style.display = "flex";
}

authInfo.innerText = `Hai, ${email}`;

// Jika edit, ubah judul halaman dan isi form
if (isEdit) {
  title.innerText = "Edit Rumah";

  async function loadRumah() {
    try {
      const res = await fetch(`http://localhost:5000/rumah/${rumahId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Gagal mengambil data rumah");

      const data = await res.json();
      form.nama.value = data.nama;
      form.lokasi.value = data.lokasi;
      form.harga.value = data.harga;
      form.deskripsi.value = data.deskripsi;
    } catch (err) {
      alert(err.message);
      window.location.href = "index.html";
    }
  }

  loadRumah();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const res = await fetch(
      isEdit ? `http://localhost:5000/rumah/${rumahId}` : "http://localhost:5000/rumah",
      {
        method: isEdit ? "PATCH" : "POST",   // Ganti PUT jadi PATCH sesuai route backend
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    const text = await res.text();

    if (!res.ok) throw new Error(text);

    const data = JSON.parse(text);

    alert(isEdit ? "Rumah berhasil diperbarui" : "Rumah berhasil ditambahkan");
    window.location.href = "index.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
});

function logout() {
    localStorage.removeItem("token");
    location.href = "login.html";
}