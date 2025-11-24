const apiKey = "60aa7b10718b91e4d2ac592dc50fcd6d";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        return;
    }
    var data = await response.json();


    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    if (data.weather[0].main == "Clouds") {
        document.querySelector(".weather-icon").src = "images/clear.png";
    }
    else if (data.weather[0].main == "Clear") {
        document.querySelector(".weather-icon").src = "images/clear.png";
    }
    else if (data.weather[0].main == "Rain") {
        document.querySelector(".weather-icon").src = "images/rainy.png";
    }
    if (data.weather[0].main == "Drizzle") {
        document.querySelector(".weather-icon").src = "images/drizzle.png";
    }

    document.querySelector(".weather").style.display = "block";
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
checkWeather();