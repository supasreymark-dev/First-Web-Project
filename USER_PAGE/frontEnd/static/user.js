const LogInForm = document.getElementById("login-form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginBtn = document.getElementById("log-in-btn");
const label = document.querySelectorAll("label");
const errorMessage = document.getElementById("errorMessage");



async function checkIP() {
    
    try{
        const response = await fetch(`${API_URL}/restrictIP`, {
            method: "POST"
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error("Error");
        }


        if(data.flagged){
            username.disabled = true;
            password.disabled = true;
            loginBtn.disabled = true;
            label.forEach((labels) => {
                labels.style.color = "gray";
                console.log(labels);
            });

            window.location.replace("./../pages/error.html");
            return;
        }

        username.disabled = false;
        password.disabled = false;
        loginBtn.disabled = false;
        console.log(data.result);
        console.log(data.flagged);
        return;
    }
    catch(error){
        console.log(error);
    }

    return;
}

checkIP();
console.log(label);

LogInForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try{
        const response = await fetch(`${API_URL}/userLogIn`, {
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
            errorMessage.classList.add("hidden");
            console.log(data.message);
            console.log(data.isTrue);
            window.location.replace("https://react-user-dashboard-46gr.onrender.com")
            return;
        }

        else{
            errorMessage.classList.remove("hidden");
            console.log("test run");
            console.log("MALI ANG USERNAME UG PASSWORD");
            username.value = "";
            password.value = "";
            checkIP();
            username.focus();
            return;
        }

    }catch(error){
        console.log("test run error");
    }
});