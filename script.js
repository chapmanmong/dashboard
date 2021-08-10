 class DigitalClock {
     constructor(element) {
         this.element = element;
     }

     start(){
         this.update();
         setInterval(() => {
             this.update();
         }, 500);
     }

     update(){
        const parts = this.getTimeParts();
        const minutesFormatted = parts.minute.toString().padStart(2, "0");
        const timeFormatted = `${parts.hour}:${minutesFormatted}`
        const amPM = parts.isAM ? "AM" : "PM";

        this.element.querySelector(".clock-time").textContent = timeFormatted;
        this.element.querySelector(".clock-ampm").textContent = amPM;
        console.log(timeFormatted);
    };

     getTimeParts(){
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
