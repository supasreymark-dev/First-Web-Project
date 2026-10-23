import style from './Header.module.css';
import { useState } from 'react';
import MainBody from './../MainBody/MainBody.jsx';


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
            window.location.replace(`${API_URL}/user`);
            return;
        }
        else{
            alert(`Session expired!`);
            window.location.replace(`${API_URL}/user`);
            return;
        }
    }catch(error){
        alert(error);
        window.location.replace(`${API_URL}/user`);
        return;
    }
}


function Header({username, setTab}){

    const API_URL = "http://127.0.0.1:8000";
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