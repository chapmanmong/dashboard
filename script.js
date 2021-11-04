const KEY = "AIzaSyBrI2TLDVgMq3uZlOdd2nTk1TKXW2jsLzM"
const OPENWEATHERAPI = "608ac5b8c6bf5a9a1ff1a77467cb0f28"

var options = { month: 'long' };
var long;
var lat;

class DigitalClock {
    constructor(element) {
        this.element = element;
    }

    // This function runs after the clock is instantiated to run update once then every .5 seconds
    start() {
        this.update();
        setInterval(() => {
            this.update();
        }, 500);
    }

    // This function updates the clock face
    update() {
        const parts = this._getTimeParts();

        // Pull the time/date components from the "parts" variable
        const minutesFormatted = parts.minute.toString().padStart(2, "0");
        const timeFormatted = `${parts.hour}:${minutesFormatted}`
        const amPM = parts.isAM ? "AM" : "PM";
        const month = parts.month;
        const date = parts.date;
        const year = parts.year;

        // Render the timeparts to the clock face
        this.element.querySelector(".clock-time").textContent = timeFormatted;
        this.element.querySelector(".clock-ampm").textContent = amPM;
        this.element.querySelector(".date").textContent = `${month} ${date}, ${year}`;
    };

    // Helper function that creates a new date object representing the current time and returns an object with the timeparts
    _getTimeParts() {
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

// Instatiate clock element
const clockElement = document.querySelector(".clock");
const clockObject = new DigitalClock(clockElement);

clockObject.start()

// if ('geolocation' in navigator) {
//     console.log("geolocation available");
// } else {
//     console.log("geolocation not available");
// }

// Get the current coordinates from the browser and build query strings to pass on to getLocation and getWeather functions
navigator.geolocation.getCurrentPosition((position) => {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    query = `https://maps.googleapis.com/maps/api/geocode/json?result_type=locality&latlng=${lat},${long}&key=${KEY}`;
    getLocation(query);
    weatherQuery = `https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=${lat}&lon=${long}&appid=${OPENWEATHERAPI}`;
    getWeather(weatherQuery);
});

// Function that queries Google API and gets the name of the current location and renders it on the clockface
function getLocation(query) {
    fetch(query)
        .then(response => response.json())
        .then(data => {
            loc = data.results[0].address_components[0].long_name;
            clockObject.element.querySelector(".location").textContent = loc;
        })
        .catch(err => console.warn(err.message));
}

// Function that queries the openweathermap API to get current temperature and weather and render on clockface
function getWeather(weatherQuery) {
    fetch(weatherQuery)
        .then(response => response.json())
        .then(data => {
            // Get the current weather data
            var current_temp = data.current.temp;
            var current_desc = data.current.weather[0].description;
            var weather_id = data.current.weather[0].id;
            // getForecast() gets the weather forecast for the next 7 days
            getForecast(data);
            clockObject.element.querySelector(".temp").textContent = current_temp;
            clockObject.element.querySelector(".conditions").textContent = current_desc;
            clockObject.element.querySelector(".condition-icon").innerHTML = idToIcon(weather_id);
        })
        .catch(err => console.warn(err));
}

// Helper function that takes in an id from weathermap and returns a corresponding weather icon from font awesome
function idToIcon(id) {
    if (id >= 200 && id < 300) {
        return `<i class="fas fa-bolt"></i>`;
    }
    else if (id >= 300 && id < 400) {
        return `<i class="fas fa-cloud-rain"></i>`;
    }
    else if (id >= 500 && id < 600) {
        return `<i class="fas fa-cloud-showers-heavy"></i>`;
    }
    else if (id >= 600 && id < 700) {
        return `<i class="fas fa-snowflake"></i>`;
    }
    else if (id >= 700 && id < 800) {
        return `<i class="fas fa-exclamation"></i>`;
    }
    else if (id == 800) {
        return `<i class="fas fa-sun"></i>`;
    }
    else if (id > 800) {
        return `<i class="fas fa-cloud"></i>`;
    }

}

// Function that gets the forecast weather for the next 7 days
function getForecast(data) {
    forecastList = document.querySelector(".forecast-list")
    //Create a new list element for each day and build the descriptions and append it to the forecastList unordered list
    for (i = 1; i < 8; i++) {
        newLi = document.createElement('li');
        const minTemp = data.daily[i].temp.min;
        const maxTemp = data.daily[i].temp.max;
        const desc = data.daily[i].weather[0].description;
        const weather_id = data.daily[i].weather[0].id;
        icon = idToIcon(weather_id)
        const text = `Min: ${minTemp}°C | Max:${maxTemp}°C | ${desc} | `
        const date = new Date(data.daily[i].dt * 1000);
        let formattedDate = new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric' }).format(date);
        newLi.textContent = formattedDate + ": " + text;
        newSpan = document.createElement("span");
        newSpan.innerHTML = icon;
        newLi.append(newSpan);
        forecastList.append(newLi)
    }
}

//To-do Section
todoContainer = document.querySelector(".todo-container")
todoInput = document.querySelector(".todo-input");
addButton = document.querySelector(".addBtn")

document.addEventListener("DOMContentLoaded", load_items());
addButton.addEventListener("click", addItem);

// This function creates a new div representing a new to-do item onto  todoContainer
function addItem() {
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
    checkBtn.addEventListener("click", checkItem)
    const trashBtn = document.createElement("button");
    trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
    trashBtn.classList.add("trashBtn")
    trashBtn.addEventListener("click", deleteItem);
    todoDiv.append(checkBtn);
    todoDiv.append(trashBtn);
    todoContainer.append(todoDiv);

    //add to storage:
    saveLocalTodos(newItem);
}

function checkItem(e) {
    const item = e.target.parentElement.children[0];
    item.classList.toggle("checked");
}

function deleteItem(e) {
    const item = e.target.parentElement;
    console.log(item.children[0].innerText)
    //remove item from localStorage
    todos = JSON.parse(localStorage.getItem("todos"));
    index = todos.indexOf(item.children[0].innerText)
    todos.splice(index, 1)
    localStorage.setItem("todos", JSON.stringify(todos));
    //remove from screen
    item.remove();
}

//local storage functionality
function saveLocalTodos(todo) {
    //check if localStorage already exists
    let todos;
    if (localStorage.getItem("todos") === null || localStorage.getItem("todos").length == 0) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    if (todos != null) {
        todos.push(todo);
        localStorage.setItem("todos", JSON.stringify(todos));
    }

}

function load_items() {
    if (localStorage.getItem("todos") != null) {
        let items = JSON.parse(localStorage.getItem("todos"))
        console.log(items);

        // Recreate the todo items from local storage and render them on the todoContainer
        for (var i = 0; i < items.length; i++) {
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo")
            const todoLi = document.createElement("li");
            todoLi.innerText = items[i];
            todoDiv.append(todoLi);
            const checkBtn = document.createElement("button");
            checkBtn.innerHTML = '<i class="fas fa-check"></i>'
            checkBtn.classList.add("checkBtn")
            checkBtn.addEventListener("click", checkItem)
            const trashBtn = document.createElement("button");
            trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
            trashBtn.classList.add("trashBtn")
            trashBtn.addEventListener("click", deleteItem);
            todoDiv.append(checkBtn);
            todoDiv.append(trashBtn);
            todoContainer.append(todoDiv);
        }
    }
}

