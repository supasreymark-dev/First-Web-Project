import style from './Update.module.css';
import { useState, useRef } from 'react';




function Update({newUsernameUpdate}){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const usernameRef = useRef(null);
    // const [newUsernameUpdate, setNewUsernameUpdate] = useState("");
    // const [confirmUsername, setConfirmUsername] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(event);
        console.log(event.target);
        console.log(event.target.value);


        try{
            const response = await fetch("http://127.0.0.1:8000/userUpdateAccount", {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    newUsername: newUsername,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPass: confirmPass,
                })
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error("ATAYA");
            }
            else{
                console.log(data.message);
                console.log(data.isTrue);

                if(data.isUsernameUpdated){
                    newUsernameUpdate(data.newUsername);
                }

                if(data.isTrue){
                    setActive(false);    
                }
                else{
                    setActive(true);
                }

                setUsername("");
                setPassword("");
                setNewUsername("");
                setOldPassword("");
                setNewPassword("");
                setConfirmPass("");

                usernameRef.current?.focus();

            }
        }
        catch(error){
            setUsername("");
            setPassword("");
            setNewUsername("");
            setOldPassword("");
            setNewPassword("");
            setConfirmPass("");
            setActive(true);

            usernameRef.current?.focus();
            console.log(error);
        }

    }

    function ClearField(){
        setUsername("");
        setPassword("");
        setNewUsername("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPass("");

        setActive(false);

        usernameRef.current?.focus();
    }

    const [active, setActive] = useState(false);

    return(
        <main className={style.body}>
            <h2 className={style.header}>
                Update Account
                <hr />    
            </h2>

            <div className={style.wrapper}>
                <form action="#" className={style.forms} onSubmit={handleSubmit}>

                    <div className={style.inputFields}>

                        <div className={style.verifyInfo}>
                            <div className={`${active ? style.active : ""} ${style.errorMsg}`}>
                                <span>Invalid Username or Password</span>
                            </div>
                            <div className={style.username}>
                                <label htmlFor="username">Username</label>
                                <input type="text" id='username' ref={usernameRef} value={username} onChange={(event) => setUsername(event.target.value)} required/>
                            </div>
                            <div className={style.password}>
                                <label htmlFor="password">Password</label>
                                <input type="password" id='password' value={password} onChange={(event) => setPassword(event.target.value)} required/>
                            </div>

                            
                        </div>

                        {/* <hr className={style.hidden}/> */}

                        <div className={style.newInfo}>
                            <div className={style.newUsername}>
                                <label htmlFor="newUsername">Username (Optional)</label>
                                <input type="text" id='newUsername' placeholder='' value={newUsername} onChange={(event) => setNewUsername(event.target.value)}/>
                            </div>

                            <div className={style.oldPassword}>
                                <label htmlFor="oldPassword">Old Password</label>
                                <input type="password" id='oldPassword' value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} required/>
                            </div>

                            <div className={style.newPass}>
                                <label htmlFor="newPass">New Password</label>
                                <input type="password" id='newPass' value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required/>
                            </div>

                            <div className={style.confirmPass}>
                                <label htmlFor="confirmPass">Confirm Password</label>
                                <input type="password" id='confirmPass' value={confirmPass} onChange={(event) => setConfirmPass(event.target.value)} required/>
                            </div>

                        </div>

                    </div>

                    <div className={style.buttons}>
                        <button type='submit'>Confirm change</button>
                        <button type='button' onClick={ClearField}>Clear fields</button>
                    </div>

                </form>
            </div>
        </main>
    );
}

export default Update