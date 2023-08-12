const menubutton = document.getElementById("menu-button");

const date = document.getElementById("date");

const greetingText = document.getElementById("greeting-text");

var currentDate = new Date();

var unixStartDate = null;

date.valueAsDate = currentDate;

date.max = new Date().toISOString().split("T")[0];

currentDate.setMonth(currentDate.getMonth() - 6);

date.valueAsDate = currentDate;

document.querySelectorAll(".nav-link").forEach((link) => {
  if (link.href === window.location.href) {
    link.parentElement.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

const currentHour = new Date().getHours();

if (currentHour < 12) {
  greetingText.innerText = "Good Morning , ";
} else if (currentHour < 17) {
  greetingText.innerText = "Good Afternoon, ";
} else {
  greetingText.innerText = "Good Evening, ";
}

if (window.localStorage.getItem("navbar") === "closed") {
  const navbar = document.getElementById("navbar");
  navbar.classList.remove("opened");
  navbar.classList.add("closed");
}

document.querySelectorAll(".nav-link").forEach((link) => {
  if (link.href === window.location.href) {
    link.parentElement.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

menubutton.addEventListener("click", () => {
  const navbar = document.getElementById("navbar");
  if (navbar.classList.contains("opened")) {
    navbar.classList.remove("opened");
    navbar.classList.add("closed");
    window.localStorage.setItem("navbar", "closed");
  } else if (navbar.classList.contains("closed")) {
    navbar.classList.remove("closed");
    navbar.classList.add("opened");
    window.localStorage.setItem("navbar", "opened");
  } else {
  }
});
