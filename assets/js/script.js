// major city array
const majorCityArray = [
  {
    name: "Atlanta",
    lat: 33.757586,
    lng: -84.386857,
  },
  {
    name: "Baltimore",
    lat: 39.2911,
    lng: -76.612918,
  },
  {
    name: "Boston",
    lat: 42.352468,
    lng: -71.06428,
  },
  {
    name: "Chicago",
    lat: 41.888267,
    lng: -87.630671,
  },
  {
    name: "Dallas",
    lat: 32.780207,
    lng: -96.799557,
  },
  {
    name: "Detroit",
    lat: 42.3314,
    lng: -83.0458,
  },
  {
    name: "Los Angeles",
    lat: 34.041343,
    lng: -118.258614,
  },
  {
    name: "Miami",
    lat: 25.788578,
    lng: -80.13556,
  },
  {
    name: "Nashville",
    lat: 36.16256,
    lng: -86.776951,
  },
  {
    name: "New York City",
    lat: 40.754114,
    lng: -73.991459,
  },
  {
    name: "Philadelphia",
    lat: 39.951631,
    lng: -75.163932,
  },
  {
    name: "Portland",
    lat: 45.515678,
    lng: -122.678067,
  },
  {
    name: "Seattle",
    lat: 47.604578,
    lng: -122.331016,
  },
  {
    name: "St. Louis",
    lat: 38.622053,
    lng: -90.19451,
  },
  {
    name: "Washington D.C.",
    lat: 38.88137,
    lng: -77.019347,
  },
];

$(document).ready(function () {
  function searchMajorCity(event) {
    const cityName = event.target.textContent;
    let latitude;
    let longitude;

    for (let i = 0; i < majorCityArray.length; i++) {
      if (cityName == majorCityArray[i].name) {
        latitude = majorCityArray[i].lat;
        longitude = majorCityArray[i].lng;
        break;
      }
    }

    callBrewery(latitude, longitude);
    saveSearchedCity(cityName);
    $(".recent-btn").remove();
    displayRecents();
  }
  // clicking the dropdown menu will call the searchMajorCity function to compare the value in the array then push the lat & lng to parking fetch function.
  $(".dropdown-content").click(searchMajorCity);
});

// function to call the openbrewerydb API.
function callBrewery(lat, lng) {
  const apiUrl = "https://api.openbrewerydb.org/breweries?by_dist=" + lat + "," + lng;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then((data) => breweryDisplay(data));
    } else {
      $("#modalJs").addClass("is-active");
      $("html").addClass("is-clipped");
      $("#modalClose").on("click", function () {
        $("html").removeClass("is-clipped");
        window.location.reload();
      });
    }
  });
}

// function to display 5 breweries based on the city


// function to display 5 breweries based on the city search.
function breweryDisplay(results) {
  $(".fa-beer-mug-empty").remove();
  for (i = 1; i <= 5; i++) {
    const breweryName = results[i - 1].name;
    const breweryAddress = results[i - 1].street;
    const breweryCity = results[i - 1].city;

    // adds style/display to the brewery results
    $("#brewery-" + i).attr("class", "m-4 p-1 has-background-info-light parking-info");
    $("#brewIcon-" + i).append("<i class='fa-solid fa-beer-mug-empty fa-2x'></i>");
    $("#brewName-" + i).text(breweryName);
    $("#brewAddress-" + i).text(breweryAddress + ", " + breweryCity);
  }
}

function saveSearchedCity(cityName) {
  var recentlyViewedCity = JSON.parse(localStorage.getItem("city"));

  // if there is no information saved in local storage it will create a new array, most recents will be saved on top by unshift
  if (recentlyViewedCity == null) {
    recentlyViewedCity = [];
    recentlyViewedCity.unshift(cityName);
    localStorage.setItem("city", JSON.stringify(recentlyViewedCity));
  }

  // page will only save 5 recently viewed cities and will pop after length surpasses
  if (recentlyViewedCity.length > 4) {
    recentlyViewedCity.pop();
  }

  // will only add recent to local storage if it is not already in the array
  if (!recentlyViewedCity.includes(cityName)) {
    recentlyViewedCity.unshift(cityName);
    localStorage.setItem("city", JSON.stringify(recentlyViewedCity));
  }
}

// function to display the recently viewed cities from local storage
function displayRecents() {
  var recentlyViewedCity = JSON.parse(localStorage.getItem("city"));
  $(".recent-btn").remove();

  // assigns attributes and dynmically creates the button for recently viewed
  if (recentlyViewedCity) {
    for (let i = 0; i < recentlyViewedCity.length; i++) {
      var recentBtn = $("<button>");
      recentBtn.attr("class", "button recent-btn column is-centered is-full has-text-centered m-2 has-background-info-light");
      recentBtn.attr("type", "button");
      recentBtn.attr("value", recentlyViewedCity[i]);
      recentBtn.text(recentlyViewedCity[i]);
      $("#recentBtn").append(recentBtn);
    }

    // upon click, it will run the searchRecent function to call the APIs
    $(".recent-btn").click(searchRecent);
  }
}

// function to run the API calls upon click of the recent buttons using lat and long as parameters
function searchRecent(event) {
  const cityName = event.target.textContent;
  let latitude;
  let longitude;

  for (let i = 0; i < majorCityArray.length; i++) {
    if (cityName == majorCityArray[i].name) {
      latitude = majorCityArray[i].lat;
      longitude = majorCityArray[i].lng;
      break;
    }
  }

  // callParkingApi(latitude, longitude);
  callBrewery(latitude, longitude);
}

displayRecents();
