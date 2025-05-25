document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = "user"; // default role

  try {
    const response = await fetch(`${baseURL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registrasi berhasil! Silakan login.");
      window.location.href = "login.html";
    } else {
      alert(data.msg || "Registrasi gagal");
    }
  } catch (error) {
    console.error("Error saat registrasi:", error);
    alert("Terjadi kesalahan saat registrasi");
  }
});
