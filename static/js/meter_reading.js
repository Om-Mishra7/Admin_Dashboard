const menubutton = document.getElementById("menu-button");
const greetingText = document.getElementById("greeting-text");
const profilePicture = document.getElementById("profile-picture");
const userName = document.getElementById("user-name");
const displayTimeRange = document.getElementById("display-time-range");
const timeRange = document.getElementById("time-range");

timeRange.addEventListener("change", refreshData);

fetch("/api/v1/user/profile", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    profilePicture.setAttribute("src", data.profile_picture_url);
    userName.innerHTML = data.user_name;
  });

function refreshData() {
  displayTimeRange.innerHTML = `${timeRange.value} - ${
    parseInt(timeRange.value) + 1
  }`;
  fetch(`/api/v1/meter-reading?year=${timeRange.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (timeRange.value == new Date().getFullYear()) {
        meterReadingChart.data.datasets[0].data = data[0];
        meterReadingChart.data.datasets[1].data = data[1];
        meterReadingChart.update();

        costPrimaryChart.data.labels = Object.keys(data[2]);
        costPrimaryChart.data.datasets[0].data = Object.values(data[2]);
        costPrimaryChart.update();

        consumptionByCircleData = []
        for (let i = 0; i < Object.keys(data[3]).length; i++) {
          consumptionByCircleData.push({"label": Object.keys(data[3])[i], "data": Object.values(data[3])[i]})
        }

        consumptionByCircleChart.data.labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].slice(0, Object.values(data[3])[1].length);
        consumptionByCircleChart.data.datasets = consumptionByCircleData;
        ChartColor();
        consumptionByCircleChart.update();
      
      }
      else{
        meterReadingChart.data.datasets[0].data = data[0];
        meterReadingChart.data.datasets[1].data = data[0];
        meterReadingChart.update();

        costPrimaryChart.data.labels = Object.keys(data[1]);
        costPrimaryChart.data.datasets[0].data = Object.values(data[1]);
        costPrimaryChart.update();

        consumptionByCircleData = []
        for (let i = 0; i < Object.keys(data[2]).length; i++) {
          consumptionByCircleData.push({"label": Object.keys(data[2])[i], "data": Object.values(data[2])[i]})
        }

        consumptionByCircleChart.data.labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].slice(0, Object.values(data[2])[1].length);
        consumptionByCircleChart.data.datasets = consumptionByCircleData;
        ChartColor();
        consumptionByCircleChart.update();
      }
      
      
    })
    .catch((err) => {
      console.log(err);
    });
}

refreshData();

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

const exportButton = document.getElementById("export-button");

exportButton.addEventListener("click", () => {
  fetch(`/api/v1/export?year=${timeRange.value}&uri=meter-reading`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      download(blob, `Meter_Reading_Report_${timeRange.value}.csv`);
    });
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

const customPalette = [
  "#36a2eb",
  "#ff6384",
  "#4bc0c0",
  "#ff9f40",
  "#9966ff",
  "#ffcd56",
  "#c9cbcf",
  "#003f5c",
  "#a05195",
  "#2f4b7c",
  "#fa4d56",
  "#ba4e00",
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
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
    datasets: [
      {
        label: "Actual MR",
        data: [],
        fill: true,
      },
      {
        label: "Predictive MR",
        data: [],
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
        beginAtZero: true,
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
      labels: [

      ],
      datasets: [
        {
          data: [],
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
      labels: [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
      ],
      datasets: [
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
          beginAtZero: true,
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

function ChartColor(colorValue = 0) {
  for (let i = 0; i < consumptionByCircleChart.data.datasets.length; i++) {
    if (colorValue >= customPalette.length) {
      colorValue = colorValue - customPalette.length;
    }

    consumptionByCircleChart.data.datasets[i].backgroundColor =
      customPalette[colorValue];
    consumptionByCircleChart.update();
    colorValue++;
  }
}

ChartColor();

function hideLoader() {
  const hide = document.querySelectorAll(".hide");
  hide.forEach((element) => {
    element.classList.remove("hide");
  });

  const loader = document.getElementById("loader");
  loader.setAttribute("style", "display: none !important");
}

window.addEventListener("load", hideLoader);
