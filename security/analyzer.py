from backEnd.DBarchitecture.database import SessionLocal
from backEnd.DBarchitecture import models

def show_admin_data():

    db = SessionLocal()

    try:
        loggedData = db.query(models.Admin).all()

        for data in loggedData:
            print(f"ID : {data.id}")
            print(f"Username : {data.username}")
            print(f"Password : {data.password}")

            print("-" * 40)

    finally:
        db.close()
        # pass


show_admin_data()