import style from './../../App.module.css';
import BodyStyle from './MainBody.module.css';
import About from './../About/About.jsx';
import Contact from './../Contact/Contact.jsx';
import Delete from './../Delete/DeleteAccount.jsx';
import Update from './../Update/UpdateAccount.jsx';

function MainBody({setTab, username, setUsername}){
    return(
        <main className={`${style.body} ${BodyStyle.body}`}>
            {setTab === "about" && <About username={username}/>}
            {setTab === "contact" && <Contact/>}
            {setTab === "delete" && <Delete/>}
            {setTab === "update" && <Update newUsernameUpdate={setUsername}/>}
        </main>
    );
}


export default MainBody;