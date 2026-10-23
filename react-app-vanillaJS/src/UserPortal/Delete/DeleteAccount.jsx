import { useRef } from 'react';
import style from './Delete.module.css';
import {IoIosWarning} from 'react-icons/io';

const API_URL = import.meta.env.VITE_API_BASE_URL;

async function deleteAccount(passCloseDialog){
    try{
        const response = await fetch(`${API_URL}/DeleteAccount`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error("ATAYA");
        }

        alert("Redirecting");
        window.location.replace(`${API_URL}/user`);
        return;

    }
    catch(error){
        alert("Oops, Something wen't wrong. Please try again later!");
        console.log(error);
        passCloseDialog();
    }

}


function Delete(){
    const dialogRef = useRef(null);

    function openDialog(){
        dialogRef.current.showModal();
    }

    function closeDialog(){
        dialogRef.current.close();
    }

    return(
        <main className={style.body}>
            <h2 className={style.header}>
                Delete Account
                <hr />
            </h2>

            <div className={style.content}>
                <div className={style.warning}>
                    <span>{<IoIosWarning className={style.logo}/>}</span>
                    <span> Warning!</span>
                </div>

                <div className={style.caution}>
                    <p>
                        This action will result in permanently deleting and removing of 
                        all of your personal information
                        on the database and cannot be recovered anymore if you try to log in 
                        again using this account's username and password.
                    </p>
                    <p className={style.caution1}>Proceed with caution</p>
                    <hr />
                    <button onClick={openDialog} className={style.deleteBtn1}>Delete</button>
                </div>

                <dialog ref={dialogRef} className={style.confirmationDialog}>
                    <div>
                        <p>Are you sure you want to delete this account?</p>
                    </div>

                    <div className={style.buttons}>
                        <button onClick={() => deleteAccount(closeDialog)}>Delete</button>
                        <button onClick={closeDialog}>Cancel</button>
                    </div>
                </dialog>

            </div>
        </main>
    );
}

export default Delete