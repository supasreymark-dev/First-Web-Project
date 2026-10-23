from DBarchitecture.database import SessionLocal
from DBarchitecture import models


def display_users_session():
    db = SessionLocal()

    try:
        usersSessions = db.query(models.UserSession).all()

        for session in usersSessions:
            print(f"ID : {session.id}")
            print(f"User ID : {session.user_id}")

            print("*" * 40)


    finally:
        db.close()

display_users_session()