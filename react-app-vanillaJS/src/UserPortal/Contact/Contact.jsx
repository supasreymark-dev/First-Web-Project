import style from './Contact.module.css';
// import { Mail, Phone} from 'lucide-react';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { IoIosMail, IoIosCall } from "react-icons/io";


function Contact(){
    return(
        <main className={style.body}>
            <h2 className={style.header}>Contact
                <hr />
            </h2>
            <div className={style.content}>
                <h4>Contact developer
                    <hr />
                </h4>
                <div className={style.contactLinks}>
                    <div>
                        <span className={style.logo}>
                            {<IoIosMail/>}
                        </span>
                        <a href="#">supasreymark@gmail.com</a>
                    </div>
                    <div>
                        <span className={style.logo}>{<FaFacebook/>}</span>
                        <a href="#">Reymark Supas</a>
                    </div>
                    <div>
                        <span className={style.logo}>{<FaLinkedin/>}</span>
                        <a href="#">LinkedIn</a>
                    </div>
                    <div>
                        <span className={style.logo}>{<IoIosCall/>}</span>
                        <a href="#">09308528018</a>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Contact