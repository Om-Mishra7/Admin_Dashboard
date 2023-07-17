
async function hideLoader () {
  const hide = document.querySelectorAll(".hide");
  hide.forEach((element) => {
    element.classList.remove("hide");
  });

  const loader = document.getElementById("loader");
  loader.setAttribute("style", "display: none !important");

};

window.addEventListener("load", hideLoader);



const menubutton = document.getElementById("menu-button");

const date = document.getElementById("date");

const startDate = document.getElementById("start-date");

const endDate = document.getElementById("end-date");

const greetingText = document.getElementById("greeting-text");

var currentDate = new Date();

var unixStartDate = null;

date.valueAsDate = currentDate;

date.max = new Date().toISOString().split("T")[0];

date.addEventListener("change", refreshData);

endDate.innerText =
  currentDate.getDate() +
  "-" +
  (currentDate.getMonth() + 1) +
  "-" +
  currentDate.getFullYear();

currentDate.setMonth(currentDate.getMonth() - 6);

date.valueAsDate = currentDate;

startDate.innerText =
  currentDate.getDate() +
  "-" +
  (currentDate.getMonth() + 1) +
  "-" +
  currentDate.getFullYear();

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

const copyButton = document.getElementById("copy-button");

copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href);
  const copyButtonText = document.getElementById("copy-button-text");
  copyButtonText.innerText = "Copied";
  setTimeout(() => {
    copyButtonText.innerText = "Share";
  }, 5000);
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

function refreshData() {
  console.log("Refreshing Data");
  const date = document.getElementById("date").valueAsDate;
  const startDate = document.getElementById("start-date");
  startDate.innerText =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  unixStartDate = date.getTime() / 1500;
  console.log("Data Refreshed");
}

const modalOpenButton = document.querySelectorAll(".view-button");

modalOpenButton.forEach((button) => {
  button.addEventListener("click", () => {
    modal.classList.add("active");

    const modalID = document.getElementById("modalID");

    modalID.innerText = button.getAttribute("data-incidentID");

    const main = document.getElementById("main");
    main.classList.add("modal-active");

    const aside = document.getElementById("aside");
    aside.classList.add("modal-active");
  });
});

const modalCloseButton = document.getElementById("modal-close-button");

const modal = document.getElementById("modal");

modalCloseButton.addEventListener("click", () => {
  modal.classList.remove("active");

  const main = document.getElementById("main");
  main.classList.remove("modal-active");

  const aside = document.getElementById("aside");
  aside.classList.remove("modal-active");
});

const customPalette = [
  "#6929c4",
  "#1192e8",
  "#005d5d",
  "#9f1853",
  "#fa4d56",
  "#570408",
  "#198038",
  "#002d9c",
  "#ee538b",
  "#b28600",
  "#009d9a",
  "#012749",
  "#012749",
  "#a56eff",
];

var dataset = [
  {
    label: "GUJARAT",
    data: [65, 59, 80, 81, 56, 55, 40],
  },
  {
    label: "MAHARASHTRA",
    data: [77, 88, 99, 150, 66, 77, 44],
  },
  {
    label: "RAJASTHAN",
    data: [88, 99, 150, 110, 77, 88, 55],
  },
  {
    label: "MADHYA PRADESH",
    data: [99, 110, 121, 132, 88, 99, 66],
  },
  {
    label: "UTTAR PRADESH",
    data: [110, 121, 132, 143, 99, 110, 77],
  },
];

const incidentPrimaryChart = new Chart(
  document.getElementById("incidentPrimaryChart").getContext("2d"),
  {
    type: "line",
    data: {
      labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
      datasets: dataset,
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            display: true,
            drawBorder: false,
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
      },
      tension: 0.3,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: {
              size: 10,
            },
          },
        },
      },
    },
  }
);

function ChartColor(colorValue = 0) {
  for (let i = 0; i < incidentPrimaryChart.data.datasets.length; i++) {
    console.log("colorValue", colorValue);
    if (colorValue >= customPalette.length) {
      colorValue = colorValue - customPalette.length;
    }

    incidentPrimaryChart.data.datasets[i].borderColor =
      customPalette[colorValue];
    incidentPrimaryChart.update();
    colorValue++;
  }
}

ChartColor();

const mttrPrimaryChart = new Chart(
  document.getElementById("mttrPrimaryChart").getContext("2d"),
  {
    type: "bar",
    data: {
      labels: ["GUJ", "MAH", "RAJ", "MP", "UP", "DEL"],
      datasets: [
        {
          data: [15, 20, 30, 40, -15, 10],
          label: "MTTR (in Days)",
          backgroundColor: "rgb(44, 60, 132)",
          borderRadius: 10,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            display: true,
            drawBorder: false,
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
      },
      tension: 0.3,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: {
              size: 10,
            },
          },
        },
      },
    },
  }
);

const svgIcon = L.divIcon({
  html: `
  <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="24"><path d="M480-470q38 0 64-26t26-64q0-38-26-64t-64-26q-38 0-64 26t-26 64q0 38 26 64t64 26Zm0 424Q303-193 214.5-313T126-556q0-164 107-261t247-97h16q8 0 16 1l129 130-84 84 139 139 84-84 54 54v34q0 123-88.5 243T480-46Zm216-571-82-82 84-84-84-84 82-82 84 84 84-84 82 82-84 84 84 84-82 82-84-84-84 84Z"/></svg>`,
  className: "map-marker",
  iconSize: [24, 40],
  iconAnchor: [12, 40],
});

var map_init = L.map("map", {
  center: [23.0707, 80.0982],
  zoom: 5,
  attributionControl: false,
});

var osm = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
).addTo(map_init);

var markerOptions = {
  icon: svgIcon,
};

var marker152 = L.marker([23.0707, 80.0982], markerOptions).addTo(map_init);
marker152.bindPopup("<p style='text-align:left'>Site ID - 5465</p><p style='text-align:left'>Site Name - Agra</p><p style='text-align:left'>Site Type - 2G</p><p style='text-align:left'>Site Status - Active</p><p style='text-align:left'>Site Address - Agra, Uttar Pradesh</p><p style='text-align:left'>Site Owner - Airtel</p><p style='text-align:left'>Site Contact - 9876543210</p><p style='text-align:left'>Site Lat - 23.0707</p><p style='text-align:left'>Site Long - 80.0982</p>");

var marker153 = L.marker([25.0707, 82.0982], markerOptions).addTo(map_init);
marker153.bindPopup("<p style='text-align:left'>Site ID - 5465</p><p style='text-align:left'>Site Name - Agra</p><p style='text-align:left'>Site Type - 2G</p><p style='text-align:left'>Site Status - Active</p><p style='text-align:left'>Site Address - Agra, Uttar Pradesh</p><p style='text-align:left'>Site Owner - Airtel</p><p style='text-align:left'>Site Contact - 9876543210</p><p style='text-align:left'>Site Lat - 23.0707</p><p style='text-align:left'>Site Long - 80.0982</p>");

var marker154 = L.marker([27.0707, 84.0982], markerOptions).addTo(map_init);
marker154.bindPopup("<p style='text-align:left'>Site ID - 5465</p><p style='text-align:left'>Site Name - Agra</p><p style='text-align:left'>Site Type - 2G</p><p style='text-align:left'>Site Status - Active</p><p style='text-align:left'>Site Address - Agra, Uttar Pradesh</p><p style='text-align:left'>Site Owner - Airtel</p><p style='text-align:left'>Site Contact - 9876543210</p><p style='text-align:left'>Site Lat - 23.0707</p><p style='text-align:left'>Site Long - 80.0982</p>");

var marker155 = L.marker([29.0707, 86.0982], markerOptions).addTo(map_init);
marker155.bindPopup("<p style='text-align:left'>Site ID - 5465</p><p style='text-align:left'>Site Name - Agra</p><p style='text-align:left'>Site Type - 2G</p><p style='text-align:left'>Site Status - Active</p><p style='text-align:left'>Site Address - Agra, Uttar Pradesh</p><p style='text-align:left'>Site Owner - Airtel</p><p style='text-align:left'>Site Contact - 9876543210</p><p style='text-align:left'>Site Lat - 23.0707</p><p style='text-align:left'>Site Long - 80.0982</p>");

var marker156 = L.marker([20.0707, 75.0982], markerOptions).addTo(map_init);
marker156.bindPopup("<p style='text-align:left'>Site ID - 5465</p><p style='text-align:left'>Site Name - Agra</p><p style='text-align:left'>Site Type - 2G</p><p style='text-align:left'>Site Status - Active</p><p style='text-align:left'>Site Address - Agra, Uttar Pradesh</p><p style='text-align:left'>Site Owner - Airtel</p><p style='text-align:left'>Site Contact - 9876543210</p><p style='text-align:left'>Site Lat - 23.0707</p><p style='text-align:left'>Site Long - 80.0982</p>");
