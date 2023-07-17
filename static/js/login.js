login_button.addEventListener("click", () => {
  event.preventDefault()
  const login_button = document.getElementById("login_button");
  const alert_message = document.getElementById("alert_message");

  login_button.style.cursor = "not-allowed";
  login_button.innerHTML = "Logging in...";
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "") {
    alert_message.innerText = "Email cannot be empty";
    alert_container.style.display = "flex";
    login_button.style.cursor = "pointer";
    login_button.innerHTML = "Login";
    return;
  } else if (password === "") {
    alert_message.innerHTML = "Password cannot be empty";
    alert_container.style.display = "flex";
    login_button.style.cursor = "pointer";
    login_button.innerHTML = "Login";
    return;
  }

  const data = {
    email: email,
    password: password,
  };

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = "/dashboard";
      } else if (response.status === 401) {
        return response.json(); // Parse response JSON data
      } else if (response.status === 500) {
        throw new Error("Unexpected error occurred");
      } else {
        throw new Error("Unexpected response from the server");
      }
    })
    .then((data) => {
        console.log(data)
      alert_container.style.display = "flex";
      alert_message.innerText = "Invalid email or password";
      login_button.style.cursor = "pointer";
      login_button.innerHTML = "Login";
    })
    .catch((error) => {
        console.log(error)
      alert_container.style.display = "flex";
      alert_message.innerText = "Unexpected error occurred";
      login_button.style.cursor = "pointer";
      login_button.innerHTML = "Login";
    });
});
