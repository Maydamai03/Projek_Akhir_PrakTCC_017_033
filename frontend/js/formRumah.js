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

// ==== DESKRIPSI INTERAKTIF ====
const deskripsiInput = document.getElementById("deskripsiInput");
const deskripsiList = document.getElementById("deskripsiList");
const deskripsiHidden = document.getElementById("deskripsiHidden");
let deskripsiItems = [];

deskripsiInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const value = deskripsiInput.value.trim();
    if (value) {
      deskripsiItems.push(value);
      renderDeskripsi();
      deskripsiInput.value = "";
    }
  }
});

function renderDeskripsi() {
  deskripsiList.innerHTML = "";
  deskripsiItems.forEach((item, index) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = " " + item;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.border = "none";
    deleteBtn.style.background = "transparent";
    deleteBtn.onclick = () => {
      deskripsiItems.splice(index, 1);
      renderDeskripsi();
    };

    li.appendChild(text);
    li.appendChild(deleteBtn);
    deskripsiList.appendChild(li);
  });

  deskripsiHidden.value = deskripsiItems.join("\n");
}


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

      if (data.deskripsi) {
        deskripsiItems = data.deskripsi.split("\n");
        renderDeskripsi();
      }

    } catch (err) {
      alert(err.message);
      window.location.href = "index.html";
    }
  }

  loadRumah();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  renderDeskripsi(); // pastikan deskripsiHidden terisi

  const formData = new FormData(form);

  try {
    const res = await fetch(
      isEdit ? `http://localhost:5000/rumah/${rumahId}` : "http://localhost:5000/rumah",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    // Ambil hasil respons
    const contentType = res.headers.get("content-type");

    let message = "";
    if (contentType && contentType.includes("application/json")) {
      const json = await res.json();
      message = json.message;
    } else {
      message = await res.text();
    }

    if (!res.ok) throw new Error(message);

    alert(message);
    window.location.href = "index.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
});


function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}
