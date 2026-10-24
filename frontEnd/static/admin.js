const username = document.getElementById("username");
const password = document.getElementById("password");
const logInForm = document.getElementById("logInForm");
const TimeAndDate = document.querySelector("time-and-date");
const HOURS = document.getElementById("HOURS");
const MINUTES = document.getElementById("MINUTES");
const SECONDS = document.getElementById("SECONDS");
const MERIDIEM = document.getElementById("meridiem");

const numberDate = document.getElementById("date");
const MONTH = document.getElementById("month");
const YEAR = document.getElementById("year");
const errorMessage = document.getElementById("errorMessage");


function currentMonth(month){
    let todaysMonth;
    switch(month){
        case 0:
            todaysMonth = "January";
            break;
        case 1:
            todaysMonth = "February";
            break;
        case 2:
            todaysMonth = "March";
            break;
        case 3:
            todaysMonth = "April";
            break;
        case 4:
            todaysMonth = "May";
            break;
        case 5:
            todaysMonth = "June";
            break;
        case 6:
            todaysMonth = "July";
            break;
        case 7:
            todaysMonth = "August";
            break;
        case 8:
            todaysMonth = "September";
            break;
        case 9:
            todaysMonth = "October";
            break;
        case 10:
            todaysMonth = "November";
            break;
        default:
            todaysMonth = "December";
            break;
    }

    return todaysMonth;
}

function displayTime(){
    const d = new Date();

    let numberDate = String(d.getDate()).padStart(2, "0");
    let year = d.getFullYear();
    let month = d.getMonth();
    let Current_Month = currentMonth(month);

    let hours = d.getHours();
    let minutes = String(d.getMinutes()).padStart(2, "0");
    let seconds = String(d.getSeconds()).padStart(2, "0");

    if(hours >= 12){
        hours = String(hours).padStart(2, "0");
        myDisplayer(numberDate, Current_Month, year, hours, minutes, seconds, "PM");
        return;
    }
    else{
        myDisplayer(numberDate, Current_Month, year, hours, minutes, seconds, "AM");
        return;
    }
}

function myDisplayer(date, month, year, hours, minutes, seconds, meridiem){
    numberDate.textContent = date;
    MONTH.innerText = month;
    YEAR.innerText = year;
    HOURS.textContent = hours;
    MINUTES.textContent = minutes;
    SECONDS.innerText = seconds;
    MERIDIEM.innerText = meridiem;
}

// syntax :    setInterval(function, DelayInMilliseconds);
setInterval(displayTime, 1000);







logInForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try{
        const response = await fetch("https://first-web-project-1.onrender.com/logIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        });

        const data = await response.json();

        if(response.ok){
            alert(`${data.message}`);
            errorMessage.classList.add("hidden");
            return window.location.replace("./pages/index.html");

        }

        if(!response.ok){
            alert(response.status);
            username.value = "";
            password.value = "";
            username.focus();
            errorMessage.classList.add("hidden");
        }
        else{
            throw new Error("Error, something went wrong");
        }

    }catch(error){
        return alert(error);
    }
});
