document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Simpan token ke localStorage
      localStorage.setItem("token", data.accessToken);
      alert("Login berhasil!");
      window.location.href = "index.html"; // redirect ke halaman utama
    } else {
      alert(data.msg || "Login gagal");
    }
  } catch (error) {
    console.error("Error saat login:", error);
    alert("Terjadi kesalahan saat login");
  }
});
