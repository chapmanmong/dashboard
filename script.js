const KEY = "AIzaSyBrI2TLDVgMq3uZlOdd2nTk1TKXW2jsLzM"
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
        const month = new Intl.DateTimeFormat('en-US', options).format(parts.month);
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
            month: now.getMonth(),
            year: now.getFullYear()
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
var loc;

navigator.geolocation.getCurrentPosition((position) => {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    query = `https://maps.googleapis.com/maps/api/geocode/json?result_type=locality&latlng=${lat},${long}&key=${KEY}`;
    //console.log(query);
    getLocation(query);
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

console.log(loc);
