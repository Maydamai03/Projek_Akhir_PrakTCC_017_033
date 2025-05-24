const token = localStorage.getItem("token");

if (!token) {
  location.href = "./login.html";
}

const form = document.getElementById("formTambah");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form); // ambil semua input (termasuk file)

  try {
    const res = await fetch("http://localhost:5000/rumah", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}` // jangan set Content-Type, browser akan atur otomatis
      },
      body: formData
    });

    if (!res.ok) throw new Error("Gagal menambahkan rumah");

    alert("Rumah berhasil ditambahkan");
    location.href = "./index.html";
  } catch (err) {
    alert(err.message);
  }
});
