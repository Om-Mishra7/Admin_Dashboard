
const menubutton = document.getElementById("menu-button");

const profilePicture = document.getElementById("profile-picture");

const userName = document.getElementById("user-name");

const timeRange = document.getElementById("time-range");

const displayTimeRange = document.getElementById("display-time-range");

const greetingText = document.getElementById("greeting-text");

var dataset = []; // For Incident Primary Chart

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

const incidentPrimaryChart = new Chart(
  document.getElementById("incidentPrimaryChart").getContext("2d"),
  {
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
      labels: [],
      datasets: [
        {
          data: [],
          label: "MTTR (in Hours)",
          backgroundColor: "rgb(44, 60, 132)",
          borderRadius: 10,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
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

var map = L.map("map", {
  center: [23.0707, 80.0982],
  zoom: 5,
  attributionControl: false,
});

L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
).addTo(map);

var makerLayer = L.layerGroup().addTo(map);

var markerOptions = {
  icon: svgIcon,
};

timeRange.addEventListener("change", refreshData);

function refreshData() {
  console.log("Refreshing Data");
  displayTimeRange.innerHTML = `${timeRange.value} - ${
    parseInt(timeRange.value) + 1
  }`;
  fetch(`/api/v1/incident-management?year=${timeRange.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Seetting The MTTR Chart Data
      dataset = [];
      mttrPrimaryChart.data.datasets[0].data = Object.values(data[1]);
      mttrPrimaryChart.data.labels = Object.keys(data[1]);
      mttrPrimaryChart.update();

      // Setting The Number Of Incident Chart Data
      console.log(data[2]);
      for (var i = 0; i < Object.keys(data[2]).length; i++) {
        dataset.push({
          label: Object.keys(data[2])[i],
          data: Object.values(data[2])[i],
        });
      }
      incidentPrimaryChart.data.datasets = dataset;
      incidentPrimaryChart.update();

      // Setting The Map Data

      makerLayer.clearLayers();
      map.closePopup();

      for (var i = 0; i < data[0].length; i++) {
        var coordinate = data[0][i][14].split(",");
        var id = data[0][i][0];
        var circle_name = data[0][i][2];
        var site_name = data[0][i][3];
        var incidenCause = data[0][i][10];
        var inicdentDescription = data[0][i][8];
        var incidentDate = data[0][i][5];

        var incidentID = L.marker(
          [parseInt(coordinate[0]), parseInt(coordinate[1])],
          markerOptions
        ).addTo(makerLayer);
        incidentID.bindPopup(
          `<p style='text-align:left'>Incident ID - ${id}</p><p style='text-align:left'>Incident Date - ${incidentDate}</p><p style='text-align:left'>Circle Name - ${circle_name}</p><p style='text-align:left'>Site Name - ${site_name}</p><p style='text-align:left'>Incident Cause - ${incidenCause}</p><p style='text-align:left'>Incident Description - ${inicdentDescription}</p>`
        );
      }

      // Setting The Incident Table Data

      var incident_table = document.getElementById("incident_table");

      var rows = incident_table.getElementsByTagName("tr");

      for (var i = rows.length - 1; i > 0; i--) {
        incident_table.deleteRow(i);
      }

      for (var i = 0; i < data[0].length; i++) {
        var newRow = document.createElement("tr");

        var id = document.createElement("td");
        id.innerHTML = data[0][i][0];

        var employeeName = document.createElement("td");
        employeeName.innerHTML = data[0][i][1];

        var circleName = document.createElement("td");
        circleName.innerHTML = data[0][i][2];

        var siteID = document.createElement("td");
        siteID.innerHTML = data[0][i][3];

        var siteName = document.createElement("td");
        siteName.innerHTML = data[0][i][4];

        var incidentDate = document.createElement("td");
        incidentDate.innerHTML = data[0][i][5];

        var verified = document.createElement("td");
        verified.innerHTML = data[0][i][6];

        var approved = document.createElement("td");
        approved.innerHTML = data[0][i][7];

        var viewButton = document.createElement("td");
        viewButton.innerHTML = `<button class="view-button" data-incidentID=${data[0][i][0]}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" > <path d="M480.118-330Q551-330 600.5-379.618q49.5-49.617 49.5-120.5Q650-571 600.382-620.5q-49.617-49.5-120.5-49.5Q409-670 359.5-620.382q-49.5 49.617-49.5 120.5Q310-429 359.618-379.5q49.617 49.5 120.5 49.5ZM480-404q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 227q-154 0-278-90T17-500q61-143 185-233t278-90q154 0 278 90t185 233q-61 143-185 233t-278 90Zm0-323Zm-.08 240q120.454 0 221.267-65.5T855-500q-53-109-153.733-174.5Q600.533-740 480.08-740q-120.454 0-221.267 65.5T104-500q54 109 154.733 174.5Q359.467-260 479.92-260Z" /> </svg> View </button>`;

        newRow.appendChild(id);
        newRow.appendChild(employeeName);
        newRow.appendChild(circleName);
        newRow.appendChild(siteID);
        newRow.appendChild(siteName);
        newRow.appendChild(incidentDate);
        newRow.appendChild(verified);
        newRow.appendChild(approved);
        newRow.appendChild(viewButton);

        incident_table.appendChild(newRow);
      }

      const modalOpenButton = document.querySelectorAll(".view-button");

        modalOpenButton.forEach((button) => {
          button.addEventListener("click", () => {
            modal.classList.add("active");

            console.log(button.getAttribute("data-incidentID"));

            fetch(`/api/v1/incident-management/${button.getAttribute("data-incidentID")}`)
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                var modal_employee_name = document.getElementById("modal_employee_name");
                modal_employee_name.innerHTML = `Name Of Employee - ${data[1]}`;

                var modal_circle_name = document.getElementById("modal_circle_name");
                modal_circle_name.innerHTML = `Circle Name - ${data[2]}`;

                var modal_site_id = document.getElementById("modal_site_id");
                modal_site_id.innerHTML = `Site ID - ${data[3]}`;

                var modal_site_name = document.getElementById("modal_site_name");
                modal_site_name.innerHTML = `Site Name - ${data[4]}`;

                var modal_incident_date = document.getElementById("modal_incident_date");
                modal_incident_date.innerHTML = `Incident Date - ${data[5]}`;

                var modal_verified = document.getElementById("modal_verified");
                modal_verified.innerHTML = `Verified - ${data[6]}`;

                var modal_approved = document.getElementById("modal_approved");
                modal_approved.innerHTML = `Approved - ${data[7]}`;

                var modal_incident_type = document.getElementById("modal_incident_type");
                modal_incident_type.innerHTML = `Incident Type - ${data[9]}`;

                var modal_incident_cause = document.getElementById("modal_incident_cause");
                modal_incident_cause.innerHTML = `Incident Cause - ${data[10]}`;

                var modal_incident_description = document.getElementById("modal_incident_description");
                modal_incident_description.innerHTML = `Incident Description - ${data[8]}`;

                var modal_incident_action = document.getElementById("modal_incident_action");
                modal_incident_action.innerHTML = `Incident Action - ${data[11]}`;

                var modal_media = document.getElementById("modal_media");

                if (data[12] == null) {
                  modal_media.innerHTML = `Media - No Media`;
                } else {
                  for (i in Object.values(JSON.parse(data[12]))) {
                    image_url = Object.values(JSON.parse(data[12]))[i];

                    modal_media.innerHTML += `<a href=${image_url} target="_blank">
                    <img src=${image_url} alt="Incident Image" />
                  </a>`;

                  }
                }
                
              })

              .catch((error) => {
                console.log(error);
              });

            const modalID = document.getElementById("modalID");

            modalID.innerText = button.getAttribute("data-incidentID");

            const main = document.getElementById("main");
            main.classList.add("modal-active");

            const aside = document.getElementById("aside");
            aside.classList.add("modal-active");
          });
        });
    })
    .catch((error) => {
      console.log(error);
    });
  console.log("Refreshed Data");
}

function hideLoader() {
  const hide = document.querySelectorAll(".hide");
  hide.forEach((element) => {
    element.classList.remove("hide");
  });

  const loader = document.getElementById("loader");
  loader.setAttribute("style", "display: none !important");
}

window.addEventListener("load", hideLoader);