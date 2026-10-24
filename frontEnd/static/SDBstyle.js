const logOutBtn = document.getElementById("logout-btn");
const changePassBtn = document.getElementById("change-pass");
const ChangePassDialog = document.getElementById("change-pass-dialog");
const dialogForm = document.getElementById("dialogForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const newPass = document.getElementById("newPass");
const confirmPass = document.getElementById("confirmPass");
const ConfirmChangeBtn = document.getElementById("confirmChange-btn");
const CancelBtn = document.getElementById("cancel-btn");
const ViewerUsername = document.getElementById("viewerUsername");
const refresh = document.getElementById("refresh");
const featureContainer = document.querySelector(".feature-container");
const loadingScreen = document.getElementById("loading-screen");
const loadingAnimation = document.getElementById("loading-animation");
const failedLoginLabel = document.getElementById("failedLoginLabel");
const totalEventsLabel = document.getElementById("totalEventsLabel");
const eventTable = document.getElementById("event-table");
const suspiciousIPLabel = document.getElementById("suspiciousIPLabel");
const criticalAlertsLabel = document.getElementById("criticalAlertsLabel");


let adminUsername;

const API_URL = "https://first-web-project-1.onrender.com";
const admin_URL = "https://admin-5ghb.onrender.com";

async function injectSession() {

    try{
        const response = await fetch(`${API_URL}/me`, {
            credentials: "include"
        });

        const data = await response.json();

        if(response.ok){
            adminUsername = data.username;
            ViewerUsername.textContent = adminUsername;
            // alert("Access Granted!")
            return;
        }
        else if(!response.ok){
            alert("Bad request");
            adminUsername = "";
            return window.location.href = "./../pages/error.html";
        }
        else{
            throw new Error("Server Down");
        }
    }catch(error){
        return alert(error);
    }

}

function scanning(){
    loadingScreen.classList.add("active");

    setTimeout(doneRefreshing, 500);
}

scanning();
injectSession();

logOutBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log(event.target);
    console.log(event.target.value);
    try{
        const response = await fetch(`${API_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });

        const data = await response.json();

        if(response.ok){
            alert(`Redirecting...`);
            adminUsername = "";
            return window.location.replace(`${admin_URL}`);
        }
        else if(!response.ok){
            adminUsername = "";
            alert("Session expired");
            return window.location.replace(`${admin_URL}`);
        }
        else{
            throw new Error("Server Down");
        }
    }catch(error){
        adminUsername = "";
        alert(error);
        return window.location.replace(`${admin_URL}`);
    }
});

changePassBtn.addEventListener("click", async (event) => {
    // event.preventDefault();
    // return alert(`Redirecting`);
    
    ChangePassDialog.showModal();
});



dialogForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log(event);
    console.log(event.target);
    console.log(event.target.value);
    try{

        const respone = await fetch(`${API_URL}/me`, {
            credentials: "include"
        });

        const data = await respone.json();

        if(!respone.ok){
            throw new Error("Invalid Session");
        }

        if(newPass.value === confirmPass.value){
            if(data.username === username.value){
                try{
                    const response = await fetch(`${API_URL}/changePass`, {
                        method: "PATCH",
                        headers:{
                            "Content-Type" : "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            username: username.value,
                            oldPassword: password.value,
                            newPassword: newPass.value,
                        })
                    });

                    const data = await response.json();

                    if(response.ok){
                        alert("Changed password successfully");
                        username.value = "";
                        password.value = "";
                        newPass.value = "";
                        confirmPass.value = "";
                        ChangePassDialog.close();
                        return;
                    }
                    else{
                        alert("Invalid Credentials");
                        username.value = "";
                        password.value = "";
                        newPass.value = "";
                        confirmPass.value = "";
                        username.focus();
                        return;
                    }
                }catch(error){
                    alert("SERVER IS OFFLINE");
                    ChangePassDialog.close();
                    return;
                }
            }
            else{
                alert(`Invalid Username`);
                username.value = "";
                password.value = "";
                newPass.value = "";
                confirmPass.value = "";
                username.focus();
                return;
            }

        }
        else{
            alert("New password should match");
            newPass.value = "";
            confirmPass.value = "";
            newPass.focus();
            return;
        }
    }catch(error){
        console.log(error);
        alert(`Invalid session`);
    }
});

CancelBtn.addEventListener("click", (event) => {
    event.preventDefault();
    username.value = "";
    password.value = "";
    newPass.value = "";
    confirmPass.value = "";

    ChangePassDialog.close();
});


function extractInfo(data){
    let ip_address, attempt, severity;
    let flag_suspicious_ip = 0;
    let critical_alert = 0;

    const childrenRow = document.querySelectorAll(".tableRow");
    childrenRow.forEach((Row) => {
        Row.remove();
    });

    if((Object.keys(data).length) == 0){
        return;
    }   
    else{
        // Object.keys(data).forEach(keys => {
        //     console.log(keys);
        // });
        // return;
        for(const [keys, value] of Object.entries(data)){
            const tableRow = document.createElement("tr");
            tableRow.classList.add("tableRow");

            if(typeof(value) == 'object' && value !== null){
                for(const [nestedKeys, nestedValue] of Object.entries(value)){
                    // console.log(nestedKeys, nestedValue);
                    const tableData = document.createElement("td");
                    tableData.textContent = nestedValue;

                    if(nestedValue == "Critical"){
                        tableData.style.color = "violet";
                        critical_alert = critical_alert + 1;
                    }
                    else if(nestedValue == "High"){
                        tableData.style.color = "red";
                        flag_suspicious_ip = flag_suspicious_ip + 1;
                    }
                    else if(nestedValue == "Medium"){
                        tableData.style.color = "orange";
                    }
                    else if(nestedValue == "Low"){
                        tableData.style.color = "green";
                    }
                
                    tableRow.appendChild(tableData);
                }
                eventTable.appendChild(tableRow);
            }

            // eventTable.appendChild(tableRow);

            else{
                continue;
            }
        }

        suspiciousIPLabel.textContent = flag_suspicious_ip;
        criticalAlertsLabel.textContent = critical_alert;
        return;
    }
}

function doneRefreshing(){    
    loadingScreen.classList.remove("active");
    runScanEvent();
    // console.log("hello");
}

async function runScanEvent() {
    const response = await fetch(`${API_URL}/SecurityLogged/${adminUsername}`, {
        method: "POST",
        credentials: "include"
    });

    const data = await response.json();
    
    if(!response.ok){
        console.log("DAGMA!");
        return;
    }
    else{
        totalEventsLabel.textContent = data.count;
        failedLoginLabel.textContent = data.test_run;
        // console.log(data.information);
        // console.log(data.displayInfo);
        extractInfo(data.displayInfo);
        // console.log(data.hostIP);
        // console.log(data.sample);
        // console.log("===================")
        // console.log(data.information);
        // console.log(data.sample2);
        return;
    }
}

refresh.addEventListener("click", (event) => {
    loadingScreen.classList.add("active");

    setTimeout(doneRefreshing, 500);
});