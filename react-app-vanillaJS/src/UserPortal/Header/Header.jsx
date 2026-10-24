import style from './Header.module.css';
import { useState } from 'react';
import MainBody from './../MainBody/MainBody.jsx';

    
const login_URL = "https://user-login-ocar.onrender.com";


async function logOut({API_URL}){
    console.log(API_URL);
    try{
        const response = await fetch(`${API_URL}/userLogOut`, {
            method: "POST",
            credentials: "include"
        });

        const data = await response.json();

        if(response.ok){
            alert(`Redirecting...`);
            window.location.replace(`${login_URL}`);
            return;
        }
        else{
            alert(`Session expired!`);
            window.location.replace(`${login_URL}`);
            return;
        }
    }catch(error){
        alert(error);
        window.location.replace(`${login_URL}`);
        return;
    }
}


function Header({username, setTab}){
    const API_URL = "https://first-web-project-1.onrender.com";
    // const [activeTab, setActiveTab] = useState("about");


    function print(){
        console.log("ATAY");
    }

    return(
        <>
            <header className={style.header}>
                <div className={style.Profile}>
                    <span>
                        User: <span id='username'>{username}</span>
                    </span>
                </div>
                <button onClick={() => setTab("contact")}>Contact</button>
                <button onClick={() => setTab("about")}>About</button>
                <button onClick={() => setTab("update")}>Update Account</button>
                <button onClick={() => setTab("delete")}>Delete Account</button>
                <button onClick={() => logOut({API_URL})}>Log Out</button>
            </header>
        </>
    );
}

export default Header