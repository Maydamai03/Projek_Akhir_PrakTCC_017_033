const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

const form = document.getElementById("formRumah");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const res = await fetch("http://localhost:5000/rumah", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menambah rumah");

    alert("Rumah berhasil ditambahkan");
    location.href = "index.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
});
