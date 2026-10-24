
import { useState, useEffect } from 'react';
import HEADER from './UserPortal/Header/Header.jsx';
import style from './App.module.css';
import MAINBODY from './UserPortal/MainBody/MainBody.jsx';

const API_URL = "https://first-web-project-1.onrender.com";


function VerifyUser({isTrue, username}){
  if(!isTrue){
    return(
      <h2>INVALID SESSION, PLEASE LOGGED IN FIRST</h2>
    );
  }
  else{
    return(
      <>
        <HEADER username={username}/>
        <main>
          <h1>Welcome {username}</h1>
        </main>
      </>
    );
  }
}

function App() {
  // const API_URL = "http://127.0.0.1:8000";
  const [username, setUsername] = useState('Guest');
  const [isTrue, setTrue] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  useEffect(() => {

    async function getUsername() {
      try{

        const response = await fetch(`${API_URL}/userSession`, {
          method: "GET",
          credentials: "include"
        });

        if(!response.ok){
          throw new Error("bla bla bla");
        }

        const data = await response.json();

        setUsername(data.username);

        if(data.authorized == "True"){
          setTrue(true);
        }
        else{
          setTrue(false);
        }
      }
      
      catch(error){
        console.log(error);
        window.location.replace(`${API_URL}/error`);
        return;
      }

    }

    getUsername();

  }, []);

  


  return (

    <div className={style.page}>
      {/* <VerifyUser isTrue={isTrue} username={username}/> */}
      <HEADER username = {username}  setTab = {setActiveTab}/>
      <span className={style.greet}>Welcome, {username}!</span>
      <MAINBODY setTab={activeTab} username = {username} setUsername = {setUsername}/>
    </div>
  );
}

export default App;