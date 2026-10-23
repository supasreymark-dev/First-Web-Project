from DBarchitecture.database import SessionLocal
from DBarchitecture import models

def display_users():
    db = SessionLocal()

    try:
        usersCredentials = db.query(models.User).all()

        for data in usersCredentials:
            print(f"ID : {data.id}")
            print(f"Username : {data.username}")
            print(f"Password : {data.password}")

            print("*" * 40)

    finally:
        db.close()


display_users()