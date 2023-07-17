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

const ctxmeterReadingPrimaryChart = document
  .getElementById("meterReadingPrimaryChart")
  .getContext("2d");

const blueGradient = ctxmeterReadingPrimaryChart.createLinearGradient(
  0,
  0,
  0,
  200
);
blueGradient.addColorStop(0, "rgba(44, 60, 132, 0.5)");
blueGradient.addColorStop(1, "transparent");

const greenGradient = ctxmeterReadingPrimaryChart.createLinearGradient(
  0,
  0,
  0,
  200
);
greenGradient.addColorStop(0, "rgba(4, 164, 148, 0.5)");
greenGradient.addColorStop(1, "transparent");

const meterReadingChart = new Chart(ctxmeterReadingPrimaryChart, {
  type: "line",
  data: {
    labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"],
    datasets: [
      {
        label: "Predictive MR",
        data: [66, 56, 78, 83, 55, 53, 45, 54],
        borderColor: "rgb(4, 164, 148)",
        boderWidth: 5,
        backgroundColor: greenGradient,
        fill: true,
      },
      {
        label: "Actual MR",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgb(44, 60, 132)",
        boderWidth: 1,
        backgroundColor: blueGradient,
        fill: true,
      },
    ],
  },
  options: {
    pan: {
      enabled: true,
      mode: "x",
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return value + " KWh";
          },
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
});

const costPrimaryChart = new Chart(
  document.getElementById("costChart").getContext("2d"),
  {
    type: "doughnut",
    data: {
      labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
      datasets: [
        {
          data: [15, 20, 30, 40, 15, 10, 50],
          label: "Cost Of Energy (INR)",
          borderRadius: 5,
          backgroundColor: customPalette,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
      },
      layout: {
        padding: {
          bottom: 85,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 15,
            boxHeight: 15,
            font: {
              size: 10,
            },
          },
        },
      },
    },
  }
);

const consumptionByCircleChart = new Chart(
  document.getElementById("consumptionByCircleChart").getContext("2d"),
  {
    type: "bar",
    data: {
      labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
      datasets: [
        {
          data: [15, 20, 30, 40, 15, 10, 50],
          label: "GUJARAT",
        },
        {
          data: [20, 30, 40, 50, 25, 20, 60],
          label: "MAHARASHTRA",
        },
        {
          data: [25, 40, 50, 60, 35, 30, 70],
          label: "RAJASTHAN",
        },
        {
          data: [30, 50, 60, 70, 45, 40, 80],
          label: "MADHYA PRADESH",
        },
        {
          data: [10,20, 50, 60, 35, 30, 70],
          label: "UTTAR PRADESH",
        },
        {
          data: [30, 50, 60, 70, 45, 40, 80],
          label: "UTTARAKHAND",
        },
        {
          data: [30, 50, 60, 70, 45, 40, 80],
          label: "HARYANA",
        },
        {
          data: [30, 50, 60, 70, 45, 40, 80],
          label: "DELHI",
        },
        {
          data: [30, 50, 60, 70, 45, 40, 80],
          label: "PUNJAB",
        },
        {
          data: [30, 50, 60, 70, 45, 40, 80],
          label: "HIMACHAL PRADESH",
        },
      ],
    },
    options: {
      borderRadius: 5,
      tension: 0.3,
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            display: true,
            drawBorder: false,
          },
          ticks: {
            callback: function (value, index, values) {
              return value + " KWh";
            },
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
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

function ChartColor(colorValue=0) {
  for (let i = 0; i < consumptionByCircleChart.data.datasets.length; i++) {
    console.log("colorValue", colorValue);
    if (colorValue >= customPalette.length) {
      colorValue = colorValue - customPalette.length;
    }

    consumptionByCircleChart.data.datasets[i].backgroundColor =
      customPalette[colorValue];
    console.log(consumptionByCircleChart.data.datasets[i].backgroundColor);
    console.log(customPalette[colorValue]);
    consumptionByCircleChart.update();
    colorValue++;
  }
}

ChartColor();
