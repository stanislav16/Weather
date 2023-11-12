let cityEl;
let city;
let button = document.getElementById('value');
let lat;
let lon;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;
document.getElementById('date').innerHTML = today;


// API Key
let api = '77442ded850fd1a075869d12438a5415';

function getCityCoords(city) {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=&appid=${api}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            lat = data[0].lat;
            lon = data[0].lon;
        })
        .catch(err => {
            console.log(err);
        });
}

function getWeatherForDay(lat, lon) {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${api}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let temp = Math.floor(data.current.temp);
            document.getElementById(`temperature`).innerHTML = `${temp}°`;
            document.getElementById(`desc`).innerHTML = data.current.weather[0].description;
            document.getElementById(`wind`).innerHTML = data.current.wind_speed + ` m/s`;
            document.getElementById(`humidity`).innerHTML = data.current.humidity + ` %`;
            // Get the hourly forecast data
            let hourlyData = data.hourly;
            // Loop over the divs
            for (let i = 0; i < 7; i++) {
                // Calculate the index for the hourly data (every 3 hours)
                let index = i * 3;

                // Make sure the index is within the range of the hourly data
                if (index < hourlyData.length) {
                    // Get the temperature and round it to the nearest integer
                    let temp = Math.floor(hourlyData[index].temp);

                    // Add the temperature to the div
                    document.getElementById(`hourTemp${i + 1}`).innerHTML = `${temp}°`;
                }
            }

            let hourlyDesc = data.hourly;
            // Loop over the divs
            for (let i = 0; i < 7; i++) {
                // Calculate the index for the hourly description (every 3 hours)
                let index = i * 3;

                // Make sure the index is within the range of the hourly data
                if (index < hourlyDesc.length) {
                    // Get the description
                    let desc = hourlyData[index].weather[0].description;

                    // Add the temperature to the div
                    document.getElementById(`hourDesc${i + 1}`).innerHTML = desc;
                }
            }

            let hourlyLabel = data.hourly;
            // Loop over the divs
            for (let i = 0; i < 7; i++) {
                // Calculate the index for the hourly description (every 3 hours)
                let index = i * 3;

                // Make sure the index is within the range of the hourly data
                if (index < hourlyLabel.length) {
                    let date = new Date(hourlyLabel[index].dt * 1000);

                    // Get the hours and minutes
                    let hours = date.getUTCHours();
                    let minutes = date.getUTCMinutes();

                    // Format the hours and minutes as two-digit numbers
                    let hoursString = hours.toString().padStart(2, '0');
                    let minutesString = minutes.toString().padStart(2, '0');

                    // Combine the hours and minutes into a time string
                    let timeString = hoursString + ':' + minutesString;


                    // Add the temperature to the div
                    document.getElementById(`hourLabel${i + 1}`).innerHTML = timeString;
                }
            }

            document.getElementById(`max`).innerHTML=`H:` + Math.floor(data.daily[0].temp.max) + `°`;
            document.getElementById(`min`).innerHTML=`L:` + Math.floor(data.daily[0].temp.min) + `°`;


        })
        .catch(err => {
            console.log(err);
        });
}

// Get Weather


button.addEventListener('click', () => {
    // Get the city from the textbox
    cityEl = document.getElementById('cityBox');
    city = cityEl.value;

    getCityCoords(city)
        .then(() => {
            getWeatherForDay(lat, lon);
            document.getElementById(`cityH`).innerHTML = city;
        });
});

const cityWelcome = localStorage.getItem("cityWel");

window.onload = getCityCoords(cityWelcome)
    .then(() => {
        getWeatherForDay(lat, lon);
        document.getElementById(`cityH`).innerHTML = cityWelcome;

    });
