from fastapi import FastAPI, HTTPException, Response, Request, Depends
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime, timezone, time, timedelta


from backendUtil.eventAlgo import GetFailedLogin, ScanHost_IP, collectInfo, display
from backendUtil.password_utils import hash_password, verify_password

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

from DBarchitecture import schemas, models
from DBarchitecture.database import Base, SessionLocal, engine

import secrets

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_headers=["Content-Type"],
    allow_methods=["GET", "POST", "UPDATE", "DELETE"],
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", 
                   "https://user-login-ocar.onrender.com", 
                   "https://react-user-dashboard-46gr.onrender.com"],
)

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


app.mount("/static", StaticFiles(directory="../frontEnd/static/"), name="static")
app.mount("/page", StaticFiles(directory="../frontEnd/pages/"), name="page")
app.mount("/config", StaticFiles(directory="../frontEnd/config/"), name="config")
app.mount("/UserPageStatic", StaticFiles(directory="../USER_PAGE/frontEnd/static/"), name="UserPageStatic")



@app.post("/logIn")
def admin_login(admin: schemas.AdminLogin,response: Response, db: Session = Depends(get_db)):

    check_admin = db.query(models.Admin).filter(
        admin.username == models.Admin.username
    ).first()

    if check_admin is None:
        print(f'mali ang username')
        raise HTTPException(
            status_code=404,
            detail="Invalid Username"
        )

    if admin.password != check_admin.password:
        print(f'sakto ang username pero mali ang password')
        raise HTTPException(
            status_code=404,
            detail="Invalid Password"
        )

    session_id = secrets.token_urlsafe(32)

    new_session = models.AdminSessions(
        id = session_id,
        admin_id = check_admin.id
    )

    db.add(new_session)
    db.commit()

    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )

    return{
        "message": "Login successfully",
        "isTrue": True
    }


@app.get("/me")
def remember_me(request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")

    if session_id is None:
        print(f'walay session_id or cookies')
        raise HTTPException(
            status_code=401,
            detail="Unauthorized user"
        )

    session = db.query(models.AdminSessions).filter(
        models.AdminSessions.id == session_id
    ).first()

    if session is None:
        print(f'Naay session_id pero dili makita sa database')
        raise HTTPException(
            status_code=401,
            detail="Unauthenticate user"
        )

    admin = db.query(models.Admin).filter(
        models.Admin.id == session.admin_id
    ).first()

    return{
        "username": admin.username,
        "message": "User permitted to enter",
        "authorized": True
    }

@app.post("/logout")
def admin_logout(response: Response, request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")

    if session_id is None:
        raise HTTPException(
            status_code=404,
            detail="Session Expired"
        )

    session = db.query(models.AdminSessions).filter(
        models.AdminSessions.id == session_id
    ).first()

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid request"
        )

    db.delete(session)
    db.commit()

    response.delete_cookie("session_id")

    return{
        "message": "LOGGING OUT"
    }


@app.patch("/changePass")
def change_pass(updateAdmin: schemas.ChangePass, request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")

    if session_id is None:
        raise HTTPException(
            status_code=404,
            detail="Session expired"
        )

    check_session_id = db.query(models.AdminSessions).filter(
        models.AdminSessions.id == session_id
    ).first()

    check_admin_username = db.query(models.Admin).filter(
            models.Admin.username == updateAdmin.username
    ).first()

    if check_session_id is None or check_admin_username is None:
        raise HTTPException(
            status_code=404,
            detail="Unauthorized"
        )

    if check_admin_username.password != updateAdmin.oldPassword:
        raise HTTPException(
            status_code=404,
            detail="Invalid Password"
        )

    get_admin_username = db.query(models.Admin).filter(
        models.Admin.id == check_session_id.admin_id
    ).first()

    if updateAdmin.username != get_admin_username.username:
        raise HTTPException(
            status_code=404,
            detail="Invalid username"
        )

    check_admin_username.password = updateAdmin.newPassword

    db.commit()
    db.refresh(check_admin_username)

    return{
        "message": "Password changed successfully!",
        "isTrue": True
    }


# =============================================================================
#                       SECURITY EVENTS
# =============================================================================

# @app.post("/checkIP")
# def checking_ip(request: Request, db: Session = Depends(get_db)):
#     host_ip = request.client.host

#     if host_ip is None:
#         flagged_client = "Unknown IP"

# ===================================================
# def collectIP(host_ip: str, db: Session):

#     # collectIP = []
#     # count_ip = 0

#     scanIP = (
#         db.query(models.SecurityEvent.ip_address, 
#             func.count(models.SecurityEvent.id).label("count")
#         ).group_by(models.SecurityEvent.ip_address).all()
#     )

#     return scanIP

# ===================================================

def get_ip(db: Session):

    result = {}
    count = 0
    scanIP = (
        db.query(models.SecurityEvent.ip_address, 
            func.count(models.SecurityEvent.id).label("count")
        ).group_by(models.SecurityEvent.ip_address).all()
    )

    for row in scanIP:
        result[count] = {
            "ip_address" : row.ip_address,
            "count" : row.count
        }

        count = count + 1

    return result

    

@app.post("/SecurityLogged/{username}")
def security_logged(username: str, request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("session_id")

    if session_id is None:
        raise HTTPException(
            status_code=404,
            detail="Not authorized"
        )

    checkSession = db.query(models.AdminSessions).filter(
        models.AdminSessions.id == session_id
    ).first()

    if checkSession is None:
        raise HTTPException(
            status_code=404,
            detail = "Unauthorized access"
        )

    checkAdminUSername = db.query(models.Admin).filter(
        models.Admin.id == checkSession.admin_id
    ).first()

    if username != checkAdminUSername.username:
        raise HTTPException(
            status_code=404,
            detail="Invalid Request"
        )

    retrieveEventData = db.query(models.SecurityEvent).all()


    data = []
    hostIP = []
    info = []
    informations = {}
    count = 0


    for datas in retrieveEventData:
        data.append(datas.event_type)
        hostIP.append(datas.ip_address)
        info.append(datas)
        count = 1 + count

    iterate = 1

    for information in retrieveEventData:

        informations[iterate] = {
            "id" : information.id,
            "event_type" : information.event_type,
            "username" : information.username,
            "ip_address" : information.ip_address,
            "timestamp" : information.timestamp,
            "details" : information.details
        }

        iterate = iterate + 1



    failedLogin = GetFailedLogin(data)
    group_same_host_ip = ScanHost_IP(hostIP)
    # collectInfo(retrieveEventData)
    dispalyInfo = display(informations)


    return{
        "count" : count,
        "userInfos" : data,
        "infor" : True,
        "test_run" : failedLogin,
        "hostIP" : group_same_host_ip,
        "sample" : info,
        "information" : informations,
        "displayInfo" : dispalyInfo
    }


    





event_detail_username_error = "Unknown Username"
event_detail_password_error = "Invalid Password"
event_type_error = "login failed"

event_detail_success = "Access Granted"
event_type_success = "login successful"


# =============================================================================
#                       USER ENDPOINT
# =============================================================================

def hostIP(ipAddress, db: Session):

    checkIP = db.query(models.IPAddress).filter(
        models.IPAddress.ip_address == ipAddress
    ).first()

    if checkIP is None:
        flaggedIP = False
        return flaggedIP

    if checkIP.login_failed <= 15:
        flaggedIP = False
        return flaggedIP

    if checkIP.timestamp is None:

        timestamp = datetime.now().time().strftime("%M:%S")
        count_down = datetime.now(timezone.utc)
        checkIP.timestamp = timestamp
        checkIP.count_down = count_down

        db.commit()
        db.refresh(checkIP)

        return True

    else:
        timeNow = datetime.now(timezone.utc)
        check_countdown = checkIP.count_down

        elapse_time = timeNow - check_countdown

        if elapse_time >= timedelta(minutes=5):
            db.delete(checkIP)

            deleteIP = db.query(models.FlaggedIP).filter(
                models.FlaggedIP.ip_address == checkIP.ip_address
            ).first()

            if deleteIP is not None:
                db.delete(deleteIP)

            db.commit()

            return False

        else:
            return True



@app.post("/restrictIP")
def restrict_ip(request: Request, db: Session = Depends(get_db)):

    host_ip = request.client.host

    getIP = get_ip(db = db)
    checkIP = hostIP(host_ip, db=db)

    if checkIP:
        storeIP = db.query(models.FlaggedIP).filter(
            models.FlaggedIP.ip_address == host_ip
        ).first()

        if storeIP is None:
            restrictedIP = models.FlaggedIP(
                ip_address = host_ip
            )

            db.add(restrictedIP)
            db.commit()
            db.refresh(restrictedIP)

        return {
            "flagged": True
        }

    return {
        "flagged": False,
        "result" : getIP
    }



def storeIP(ip_address, db: Session):
    checking_ip = db.query(models.IPAddress).filter(
        models.IPAddress.ip_address == ip_address
    ).first()
    
    # login_failed_count = checking_ip.login_failed

    if checking_ip is None:
        add_ip = models.IPAddress(
            ip_address = ip_address,
            login_failed = 1
        )

        db.add(add_ip)

    else:

        checking_ip.login_failed = checking_ip.login_failed + 1

        if checking_ip.login_failed <= 10:
            checking_ip.alerts = "Low"

        elif checking_ip.login_failed <= 15:
            checking_ip.alerts = "Medium"

        elif checking_ip.login_failed <= 20:
            checking_ip.alerts = "High"

        else :
            checking_ip.alerts = "Critical"

    return checking_ip

@app.post("/userLogIn")
def user_login(user: schemas.UserCredentials, response: Response, request: Request, db: Session = Depends(get_db)):

    # ip_address = request.client.host if request.client else None

    client = request.client

    if client is not None:
        ip_address = client.host

    else:
        ip_address = "Unknown IP"


    check_user = db.query(models.User).filter(
        models.User.username == user.username
    ).first()

    if check_user is None:
        print(f'username not found')
        add_login_event = models.SecurityEvent(
            event_type = event_type_error,
            username = user.username,
            ip_address = ip_address,
            details = event_detail_username_error
        )


        # this update the IPAddress database table without executing the function
        # either this :  storing_ip = storeIP(ip_address, db=db)
        # or this     : storeIP(ip_address, db=db)
        # both can update the IPAddress database table
        storing_ip = storeIP(ip_address, db=db)
        # print(storing_ip.login_failed)
        db.add(add_login_event)
        db.commit()
        db.refresh(add_login_event)

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    verifying_password = verify_password(user.password, check_user.hash_password)

    if not verifying_password:
        print(f'cant find password')

        add_login_event = models.SecurityEvent(
            event_type = event_type_error,
            username = user.username,
            ip_address = request.client.host if request.client else None,
            details = event_detail_password_error
        )

        # update IPAddress database table
        storeIP(ip_address, db=db)

        db.add(add_login_event)
        db.commit()
        db.refresh(add_login_event)

        raise HTTPException(
            status_code=404,
            detail="Invalid password"
        )

    user_session_id = secrets.token_urlsafe(32)

    new_session = models.UserSession(
        id = user_session_id,
        user_id = check_user.id
    )

    add_login_event = models.SecurityEvent(
        event_type = event_type_success,
        username = user.username,
        ip_address = request.client.host if request.client else None,
        details = event_detail_success
    )

    db.add(new_session)
    db.add(add_login_event)
    db.commit()
    db.refresh(add_login_event)

    response.set_cookie(
        key="user_session_id",
        value=user_session_id,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
    )

    return{
        "message" : "Log in successfully",
        "isTrue" : True
    }


@app.post("/userSignUp")
def user_SignUp(user: schemas.UserCredentials, db: Session = Depends(get_db)):

    check_user = db.query(models.User).filter(
        models.User.username == user.username
    ).first()

    hashed_password = hash_password(user.password)

    if check_user is None:

        new_user = models.User(
            username = user.username,
            password = user.password,
            hash_password = hashed_password
        )

        db.add(new_user)
        db.commit()

        return{
            "message": "User created successfully with username unique!"
        }

    if check_user.password == user.password:
        raise HTTPException(
            status_code=404,
            detail="Same username and password"
        )

    new_user = models.User(
        username = user.username,
        password = user.password,
        hash_password = hashed_password
    )

    db.add(new_user)
    db.commit()

    return{
        "message": "User created successfully with the username already exist in database"
    }


@app.get("/userSession")
def User_Session(request: Request, db: Session = Depends(get_db)):
    user_session_id = request.cookies.get("user_session_id")

    if user_session_id is None:
        raise HTTPException(
            status_code=404,
            detail="No session"
        )

    check_session = db.query(models.UserSession).filter(
        models.UserSession.id == user_session_id
    ).first()

    if check_session is None:
        raise HTTPException(
            status_code=404,
            detail="user session not found"
        )

    user = db.query(models.User).filter(
        models.User.id == check_session.user_id        
    ).first()

    return{
        "username" : user.username,
        "message" : "user exist"
    }

@app.post("/userLogOut")
def user_logout(request: Request, response: Response, db: Session = Depends(get_db)):
    user_session_id = request.cookies.get("user_session_id")

    if user_session_id is None:
        raise HTTPException(
            status_code=404,
            detail="no session exist"
        )

    session = db.query(models.UserSession).filter(
        models.UserSession.id == user_session_id
    ).first()

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Session Expires"
        )

    db.delete(session)
    db.commit()

    response.delete_cookie("user_session_id")

    return{
        "message": "Logging out"
    }


@app.patch("/userUpdateAccount")
def update_account(user: schemas.UpdateAccount,request: Request, db: Session = Depends(get_db)):
    session_id = request.cookies.get("user_session_id")

    # print the cookies and session id in the browser to check what are sessions being stored in the browser
    # print("Received cookies:", request.cookies)
    # print("Received session ID:", repr(session_id))

    if session_id is None:
        print("walay session")
        raise HTTPException(
            status_code=404,
            detail="Unauthorized action"
        )

    check_session = db.query(models.UserSession).filter(
        models.UserSession.id == session_id
    ).first()

    if check_session is None:
        print("dili makita ang session")
        raise HTTPException(
            status_code=404,
            detail="Can't make the action, Session expired."
        )

    check_user_username = db.query(models.User).filter(
        models.User.id == check_session.user_id
    ).first()

    # ===================================
    # START OF RETURNING AN "isTrue" VARIABLE

    if check_user_username.username != user.username:
        print("dili mao ang username")
        return{
            "message" : "Invalid username",
            "isTrue" : False
        }


    check_password = verify_password(user.password, check_user_username.hash_password)

    if not check_password:
        print("dili mao ang password")
        return{
            "message" : "Invalid Password",
            "isTrue" : False
        }

    if user.password != user.oldPassword:
        print("dili pareha ang password")
        return{
            "message" : "Old password don't match",
            "isTrue" : False
        }

    if user.newPassword != user.confirmPass:
        print("i compare ang password")
        return{
            "message" : "New Password don't match",
            "isTrue" : False
        }

    # Remove whitespace from the start and end of the string ensuring that it will not submit a whitespace-only username
    newUsername = user.newUsername.strip()

    hashed_password = hash_password(user.newPassword)
    # check whether a newUsername contains a characters
    # if newUsername have characters inside
    if newUsername:
        check_user_username.username = user.newUsername
        check_user_username.password = user.newPassword
        check_user_username.hash_password = hashed_password

        db.commit()
        db.refresh(check_user_username)

        return{
            "message" : "Updated successfully",
            "isTrue" : True,
            "isUsernameUpdated" : True,
            "newUsername" : newUsername
        }
        
    # else if newUsername don't have characters inside
    else:
        # password must hash first before I update the user password
        check_user_username.password = user.newPassword
        check_user_username.hash_password = hashed_password
        db.commit()

        db.refresh(check_user_username)
        return{
            "message" : "Updated successfully",
            "isTrue": True,
            "isUsernameUpdated" : False
        }



@app.delete("/DeleteAccount")
def delete_account(request: Request, response: Response, db: Session = Depends(get_db)):
    user_session_id = request.cookies.get("user_session_id")

    if user_session_id is None:
        raise HTTPException(
            status_code=404,
            detail="No session"
        )

    check_session = db.query(models.UserSession).filter(
        models.UserSession.id == user_session_id
    ).first()

    if check_session is None:
        raise HTTPException(
            status_code=404,
            detail="Session expired"
        )

    check_username = db.query(models.User).filter(
        models.User.id == check_session.user_id
    ).first()

    if check_username is None:
        raise HTTPException(
            status_code=404,
            detail="Can't find user account in database"
        )

    db.delete(check_session)
    db.delete(check_username)
    db.commit()

    # this will delete the cookie associated with the current user in the browser
    response.delete_cookie(key="user_session_id", path="/")

    return{
        "message" : "Account deleted successfully!",
        "isTrue" : True
    }
    
    
# =============================================================================



# ===================================================================================
#                          ROUTING
# ===================================================================================
@app.get("/SecurityDashboard")
def security_dashboard():
    return FileResponse("../frontEnd/pages/index.html")

@app.get("/admin")
def admin_login():
    return FileResponse("../frontEnd/pages/admin.html")

@app.get("/error")
def error():
    return "https://user-login-ocar.onrender.com/pages/error"

@app.get("/user")
def get_user():

    # print(lambda:datetime.now(timezone.utc))
    print(datetime.now())
    print(f"Date without format : {datetime.today()}        Time with format : {datetime.today().strftime("%Y-%m-%d")}")
    print(f"Time without format : {datetime.now().time()}    Time with format : {datetime.now().time().strftime("%H:%M:%S")}")
    MS = datetime.now().time().strftime("%M:%S")
    print(type(MS))
    print(MS)
    return FileResponse("../USER_PAGE/frontEnd/pages/user.html")


@app.get("/SignUp")
def sign_up():
    return FileResponse("../USER_PAGE/frontEnd/pages/signUp.html")


@app.get("/Portal")
def user_portal():
    return FileResponse("../USER_PAGE/frontEnd/pages/userPortal.html")

@app.get("/RestrictIP")
def restrict_ip():
    return FileResponse("../USER_PAGE/frontEnd/pages/error.html")

# ===================================================================================
