const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const currentWeatherDiv = document.querySelector("#city-info");
const forecastDiv = document.querySelector("#city-week-forecast");
const recentSearchesList = document.querySelector("#recent-searches-list");
const clearHistoryBtn = document.querySelector(".clear-history-btn");

const API_KEY = "4c538c31a7ba968428b4a042010ae806";

// Weather card HTML
const createWeatherCard = (weatherData, isCurrentDay) => {
  const { dt_txt, main, weather, wind } = weatherData;
  const date = new Date(dt_txt);
  const icon = weather[0].icon;

  const temperature = (main.temp - 273.15).toFixed(1);
  const windSpeed = wind.speed;
  const humidity = main.humidity;

  const html = `
    <div class="col">
      <div class="card bg-dark text-light">
        <div class="card-body">
          <h5 class="card-title">${date.toLocaleDateString()}</h5>
          <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
          <p class="card-text">Temperature: ${temperature}°C</p>
          <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
          <p class="card-text">Humidity: ${humidity}%</p>
        </div>
      </div>
    </div>
  `;
  if (isCurrentDay) {
    currentWeatherDiv.innerHTML = html;
  } else {
    forecastDiv.insertAdjacentHTML("beforeend", html);
  }
};

// Fetch weather
const fetchWeatherData = (cityName) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return response.json();
    })
    .then((data) => {
      const { city, list } = data;
      currentWeatherDiv.innerHTML = "";
      forecastDiv.innerHTML = "";

      // Display current weather
      createWeatherCard(list[0], true);

      // Display 5 day weather forecast
      for (let i = 0; i < list.length; i++) {
        const weatherItem = list[i];
        const date = new Date(weatherItem.dt_txt);
        if (date.getHours() === 12) { 
          createWeatherCard(weatherItem);
        }
      }
    })
    .catch(() => {
    });
};

// Search btn click
searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (cityName) {
    fetchWeatherData(cityName);
    updateRecentSearches(cityName);
  } else {
    alert("Enter a city name");
  }
});

// Recent searches
const updateRecentSearches = (cityName) => {
  const li = document.createElement("li");
  li.textContent = cityName;
  recentSearchesList.appendChild(li);
};

// Clear history btn click
clearHistoryBtn.addEventListener("click", () => {
  recentSearchesList.innerHTML = "";
});
