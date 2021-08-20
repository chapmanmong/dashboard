const KEY = "AIzaSyBrI2TLDVgMq3uZlOdd2nTk1TKXW2jsLzM"
const OPENWEATHERAPI = "608ac5b8c6bf5a9a1ff1a77467cb0f28"

var options = { month: 'long'};

class DigitalClock {
    constructor(element) {
        this.element = element;
    }

    start() {
        this.update();
        setInterval(() => {
            this.update();
        }, 500);
    }

    update() {
        const parts = this.getTimeParts();
        const minutesFormatted = parts.minute.toString().padStart(2, "0");
        const timeFormatted = `${parts.hour}:${minutesFormatted}`
        const amPM = parts.isAM ? "AM" : "PM";
        const month = parts.month;
        const date = parts.date;
        const year = parts.year;

        this.element.querySelector(".clock-time").textContent = timeFormatted;
        this.element.querySelector(".clock-ampm").textContent = amPM;
        this.element.querySelector(".date").textContent = `${month} ${date}, ${year}`;
    };

    getTimeParts() {
        const now = new Date();
        return {
            hour: now.getHours() % 12 || 12,
            minute: now.getMinutes(),
            isAM: now.getHours() < 12,
            date: now.getDate(),
            year: now.getFullYear(),
            month: now.toLocaleString('default', { month: 'long' })
        };
    }
}

const clockElement = document.querySelector(".clock");
const clockObject = new DigitalClock(clockElement);

clockObject.start()

if ('geolocation' in navigator) {
    console.log("geolocation available");
} else {
    console.log("geolocation not available");
}

var long;
var lat;

navigator.geolocation.getCurrentPosition((position) => {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    query = `https://maps.googleapis.com/maps/api/geocode/json?result_type=locality&latlng=${lat},${long}&key=${KEY}`;
    //console.log(query);
    getLocation(query);
    weatherQuery = `https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=${lat}&lon=${long}&appid=${OPENWEATHERAPI}`;
    console.log(weatherQuery);
    getWeather(weatherQuery);
});

function getLocation(query) {
    fetch(query)
        .then(response => response.json())
        .then(data => {
            loc = data.results[0].address_components[0].long_name;
            clockObject.element.querySelector(".location").textContent = loc;
        })
        .catch(err => console.warn(err.message));
        
}

function getWeather(weatherQuery){
    fetch(weatherQuery)
        .then(response => response.json())
        .then(data => {
            var current_temp = data.current.temp;
            var current_desc = data.current.weather[0].description;
            var weather_id = data.current.weather[0].id;
            getForecast(data);
            clockObject.element.querySelector(".temp").textContent = current_temp;
            clockObject.element.querySelector(".conditions").textContent = current_desc;
            clockObject.element.querySelector(".condition-icon").innerHTML = idToIcon(weather_id);
        })
        .catch(err => console.warn(err));
}

function idToIcon(id){
    if (id >= 200 && id < 300){
        return `<i class="fas fa-bolt"></i>`;
    }
    else if (id >= 300 && id < 400){
        return `<i class="fas fa-cloud-rain"></i>`;
    }
    else if (id >= 500 && id < 600){
        return `<i class="fas fa-cloud-showers-heavy"></i>`;
    }
    else if (id >= 600 && id < 700){
       return `<i class="fas fa-snowflake"></i>`;
    }
    else if (id >= 700 && id < 800){
        return `<i class="fas fa-exclamation"></i>`;
    }
    else if (id == 800) {
        return `<i class="fas fa-sun"></i>`;
    }
    else if (id > 800){
        return `<i class="fas fa-cloud"></i>`;
    }
    
}

function getForecast(data){
    forecastList = document.querySelector(".forecast-list")
    for(i = 1; i < 8; i++){
        newLi = document.createElement('li');
        const minTemp = data.daily[i].temp.min;
        const maxTemp = data.daily[i].temp.max;
        const desc = data.daily[i].weather[0].description;
        const weather_id = data.daily[i].weather[0].id;
        icon = idToIcon(weather_id)
        const text = `Min: ${minTemp}°C | Max:${maxTemp}°C | ${desc} | `
        const date = timestampToDate(data.daily[i].dt);
        newLi.textContent = date + ": " + text;
        newSpan = document.createElement("span");
        newSpan.innerHTML = icon;
        newLi.append(newSpan);
        forecastList.append(newLi) 

    }
}

function timestampToDate(timestamp){
    console.log(timestamp);
    var options = { weekday: 'short', day: 'numeric' };
    const date = new Date(timestamp * 1000);
    // console.log(time.getMonth());
    // const month = new Intl.DateTimeFormat('en-US', options).format(8);
    // console.log(month);
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    console.log(formattedDate);
    return formattedDate;
}

//To-do Section
todoContainer = document.querySelector(".todo-container")
todoInput = document.querySelector(".todo-input");
addButton = document.querySelector(".addBtn")

addButton.addEventListener("click", addItem);

function addItem(){
    const newItem = todoInput.value;
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo")
    const todoLi = document.createElement("li");
    todoLi.innerText = newItem;
    todoDiv.append(todoLi);
    todoInput.value = "";
    const checkBtn = document.createElement("button");
    checkBtn.innerHTML = '<i class="fas fa-check"></i>'
    checkBtn.classList.add("checkBtn")
    const trashBtn = document.createElement("button");
    trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
    trashBtn.classList.add("trashBtn")
    todoDiv.append(checkBtn);
    todoDiv.append(trashBtn);
    todoContainer.append(todoDiv);

    //<i class="fas fa-check"></i>
    //<i class="fas fa-trash"></i>
}