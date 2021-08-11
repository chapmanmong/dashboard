const KEY = "AIzaSyBrI2TLDVgMq3uZlOdd2nTk1TKXW2jsLzM"

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

        this.element.querySelector(".clock-time").textContent = timeFormatted;
        this.element.querySelector(".clock-ampm").textContent = amPM;
    };

    getTimeParts() {
        const now = new Date();
        return {
            hour: now.getHours() % 12 || 12,
            minute: now.getMinutes(),
            isAM: now.getHours() < 12
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
});

console.log(long, lat);

query = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${KEY}`;
console.log(query);

fetch(query)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(err => console.warn(err.message));
