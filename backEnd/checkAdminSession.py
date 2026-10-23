from DBarchitecture.database import SessionLocal
from DBarchitecture import models


def getAdminSession():

    db = SessionLocal()

    try:
        data = db.query(models.AdminSessions).all()

        for adminData in data:
            print(f"{adminData.id}  :  {adminData.admin_id}")
            print("-" * 70)

    finally:
        db.close()

getAdminSession()