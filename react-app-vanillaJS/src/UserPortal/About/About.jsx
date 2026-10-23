import style from './About.module.css';

function About({username}){
    return(
        <main className={style.body}>
            <h2 className={style.header}>About
                <hr />
            </h2>
            <div className={style.statement}>
                <p className={style.paragraph}>
                    Hi there, {username}! Welcome to my first web application.
                </p>
                <p className={style.paragraph}>
                    This project focuses on user authentication, account management, 
                    and cybersecurity fundamentals. It explores how frontend technologies, 
                    such as React and vanilla JavaScript, work together with backend 
                    services and databases to build a functional web application. 
                    It also implements security features such as login attempt 
                    tracking and suspicious IP address detection.
                </p>
                <p className={style.paragraph}>
                    Through this project, I aim to deepen my knowledge of frontend 
                    and backend development, database security, and system protection. 
                    My interest in cybersecurity is one of the reasons I'm exploring 
                    these concepts, as I want to better understand how systems can 
                    be secured against potential threats and vulnerabilities. 
                    In the future, I hope to turn this interest into a career in 
                    cybersecurity, particularly in a role such as security engineering. 
                    I also aim to gain practical experience in deploying and maintaining 
                    a real-world website.
                </p>
                <p className={style.paragraph}>
                    I know the UI isn't as polished as I'd like it to be yet, but I'm 
                    committed to improving it as I continue learning. I'd also appreciate 
                    any suggestions or recommendations that could help me make this project better!
                </p>
                <p className={`${style.paragraph} ${style.Dev}`}>
                    Sincerely, <span className={style.devName}>Marky</span>
                </p>
                
            </div>
        </main>
    );
}

export default About