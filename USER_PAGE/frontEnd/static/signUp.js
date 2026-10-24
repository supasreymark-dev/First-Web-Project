const LoginForm = document.getElementById('login-form');
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPass = document.getElementById("confirmPass");

LoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if(password.value === confirmPass.value){

        try{
            const response = await fetch(`${API_URL}/userSignUp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value
                })
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error("Error");
            }

            alert("Signing Up successfully");
            window.location.replace("./../index.html");
            return;

        }catch(error){
            console.log(error);
            return;
        }
    }

    else{
        alert("Make sure to match your password!");
        password.value = "";
        confirmPass.value = "";
        password.focus();
        return;
    }
});