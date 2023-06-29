// Global variables
const apiKey = '4fe3b9ab993ff0a3ff4a427e9b40def8';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const searchHistorySection = document.getElementById('search-history');
let searchHistory = [];

// Event listener for the search form submission
searchForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    cityInput.value = ''; // Clear the input field
  }
});

// Function to fetch weather data from the API
function getWeather(city) {
  // Make an API call to fetch weather data
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      // Handle the received weather data
      handleWeatherData(data);
    })
    .catch(error => {
      console.log('Error:', error);
      // Display an error message to the user
    });
}

// Function to handle the received weather data
function handleWeatherData(data) {
    // Extract the required information from the data object
    const city = data.city.name;
    const forecastData = data.list;
  
    // Get current date and time
    const currentDate = new Date();
  
    // Filter the forecast data for the next 5 days
    const fiveDayForecast = forecastData.filter(forecast => {
      const forecastDateTime = new Date(forecast.dt_txt);
      return forecastDateTime.getHours() === 12 && forecastDateTime > currentDate;
    });
  
    // Create HTML elements to display forecast information
    let forecastHTML = '';
  
    // Add location to the forecast section
    forecastHTML += `<h2>${city}</h2>`;
  
    fiveDayForecast.forEach(forecast => {
      const forecastDateTime = new Date(forecast.dt_txt);
      const forecastDate = forecastDateTime.toLocaleDateString('en-US', { dateStyle: 'long' });
      const forecastIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
      const forecastTemperature = forecast.main.temp;
      const forecastHumidity = forecast.main.humidity;
      const forecastWindSpeed = forecast.wind.speed;
  
      forecastHTML += `
        <div class="forecast-card">
          <p>Date: ${forecastDate}</p>
          <img src="${forecastIcon}" alt="Weather Icon">
          <p>Temperature: ${forecastTemperature}°C</p>
          <p>Humidity: ${forecastHumidity}%</p>
          <p>Wind Speed: ${forecastWindSpeed} m/s</p>
        </div>
      `;
    });
  
    // Add the forecast HTML to the page
    forecastSection.innerHTML = forecastHTML;
  
    // Update the search history
    updateSearchHistory(city);
  
    // Update the autocomplete options
    updateAutocompleteOptions();
  }
  

// Function to update the search history
function updateSearchHistory(city) {
  // Add the city to the search history array
  searchHistory.push(city);

  // Create HTML elements to display search history
  let searchHistoryHTML = '';

  searchHistory.forEach(city => {
    searchHistoryHTML += `<button>${city}</button>`;
  });

  // Add the search history HTML to the page
  searchHistorySection.innerHTML = searchHistoryHTML;

  // Attach click event listeners to the search history buttons
  const historyButtons = searchHistorySection.getElementsByTagName('button');

  for (let i = 0; i < historyButtons.length; i++) {
    historyButtons[i].addEventListener('click', function () {
      const selectedCity = this.textContent;
      getWeather(selectedCity);
    });
  }
}

// Function to update the autocomplete options
function updateAutocompleteOptions() {
  const datalist = document.getElementById('city-list');

  // Clear existing options
  while (datalist.firstChild) {
    datalist.removeChild(datalist.firstChild);
  }

  // Create new options based on search history
  searchHistory.forEach(city => {
    const option = document.createElement('option');
    option.value = city.name + ', ' + city.state;
    datalist.appendChild(option);
  });
}

