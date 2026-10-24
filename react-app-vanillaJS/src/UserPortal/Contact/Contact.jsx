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
                        <a href="mailto:supasreymark@gmail.com" target='_blank'>supasreymark@gmail.com</a>
                    </div>
                    <div>
                        <span className={style.logo}>{<FaFacebook/>}</span>
                        <a href="https://www.facebook.com/reymark.nawagas" target='_blank'>Reymark Supas</a>
                    </div>
                    <div>
                        <span className={style.logo}>{<FaLinkedin/>}</span>
                        <a href="https://www.linkedin.com/in/reymark-supas-550a1232b/" target='_blank'>LinkedIn</a>
                    </div>
                    <div>
                        <span className={style.logo}>{<IoIosCall/>}</span>
                        <a href="tel:09308528018" target='_blank'>09308528018</a>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Contact