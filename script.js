/*
   weatherapp/script.js
   - Refactored for clarity and robustness
   - Caches DOM nodes, handles errors and loading state
   - Supports Enter key, maps weather to icons, and loads a default city

   NOTE: The API key is embedded in the frontend. For production move it
   to a server-side proxy or environment variable to avoid exposing it.
*/

const API_KEY = "60aa7b10718b91e4d2ac592dc50fcd6d";
const API_BASE = "https://api.openweathermap.org/data/2.5/weather";

(function () {
    // Cached DOM nodes
    const root = document;
    const searchInput = root.querySelector('.search input');
    const searchBtn = root.querySelector('.search button');
    const errorEl = root.querySelector('.error');
    const weatherCard = root.querySelector('.weather');
    const cityEl = root.querySelector('.city');
    const tempEl = root.querySelector('.temp');
    const humidityEl = root.querySelector('.humidity');
    const windEl = root.querySelector('.wind');
    const iconEl = root.querySelector('.weather-icon');

    const ICONS = {
        Clear: 'images/clear.png',
        Clouds: 'images/clouds.png',
        Rain: 'images/rainy.png',
        Drizzle: 'images/drizzle.png',
        Snow: 'images/rain.jpg',
        default: 'images/clear.png'
    };

    function setLoading(isLoading) {
        if (isLoading) {
            searchBtn.disabled = true;
            searchBtn.setAttribute('aria-busy', 'true');
            searchBtn.style.opacity = '0.7';
        } else {
            searchBtn.disabled = false;
            searchBtn.removeAttribute('aria-busy');
            searchBtn.style.opacity = '';
        }
    }

    function showError(message) {
        errorEl.style.display = 'block';
        errorEl.textContent = message || 'Could not find that city.';
        weatherCard.style.display = 'none';
    }

    function hideError() {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
    }

    function showWeather(data) {
        hideError();
        cityEl.textContent = data.name;
        tempEl.textContent = Math.round(data.main.temp) + '°C';
        humidityEl.textContent = data.main.humidity + '%';
        windEl.textContent = (data.wind && data.wind.speed ? data.wind.speed : 0) + ' km/h';
        const main = data.weather && data.weather[0] && data.weather[0].main;
        iconEl.src = ICONS[main] || ICONS.default;
        iconEl.alt = main || 'weather';
        weatherCard.style.display = 'block';
    }

    async function fetchWeather(city) {
        const url = `${API_BASE}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
        setLoading(true);
        try {
            const resp = await fetch(url);
            if (!resp.ok) {
                if (resp.status === 404) {
                    showError('City not found — try another name.');
                } else {
                    showError('Weather service error. Try again later.');
                }
                return null;
            }
            const json = await resp.json();
            return json;
        } catch (err) {
            showError('Network error. Check your connection.');
            return null;
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(query) {
        const city = (query || '').trim();
        if (!city) {
            showError('Please enter a city name.');
            return;
        }
        const data = await fetchWeather(city);
        if (data) showWeather(data);
    }

    // Bind events
    searchBtn.addEventListener('click', () => handleSearch(searchInput.value));
    searchInput.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') handleSearch(searchInput.value);
    });

    // Optional: load a default city on startup for immediate content
    document.addEventListener('DOMContentLoaded', () => {
        const defaultCity = 'New York';
        searchInput.value = defaultCity;
        handleSearch(defaultCity);
    });

})();