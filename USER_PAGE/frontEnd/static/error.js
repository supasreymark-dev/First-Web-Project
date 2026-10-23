// Now I know that time or Date object in javascript allowed 
// arithmetic calculation, which is a good thing for this module
// I set the flaggedAt to the time when this module is being 
// called by the error.html so that it remains when does this activated
// then I subtract it to currentTime which is inside the function that
// is continuously called or execute by the setInterval function
// then I perform conditional statement to ask if the time elapsed already 
// 5 minutes or more




const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");

const flaggedAt = new Date();
const fiveMinutes = 5 * 60 * 1000;

function countTime(){
    const currentTime = new Date();

    const elapsedTime = currentTime - flaggedAt;
    const remainingTime = Math.max(0, fiveMinutes - elapsedTime);

    const elapsedSeconds = Math.ceil(remainingTime/1000);

    const minutes = Math.floor(elapsedSeconds/60);
    const seconds = elapsedSeconds % 60;

    minutesLabel.textContent = String(minutes).padStart(2, "0");
    secondsLabel.textContent = String(seconds).padStart(2, "0");

    if(remainingTime === 0){
        clearInterval(timer);
        console.log("Five minutes have passed!");
    }
}

countTime();

const timer = setInterval(countTime, 1000);