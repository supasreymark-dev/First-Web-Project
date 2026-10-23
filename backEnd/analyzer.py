# from backEnd.DBarchitecture.database import SessionLocal
# from backEnd.DBarchitecture import models

# from .DBarchitecture.database import SessionLocal
# from .DBarchitecture import models

from DBarchitecture.database import SessionLocal
from DBarchitecture import models

def show_admin_data():

    db = SessionLocal()

    try:
        loggedData = db.query(models.Admin).all()

        print("")
        print("ID          |         Username        |        Password")
        print("")
        for data in loggedData:
            print(f"{data.id}                      {data.username}                    {data.password}")
            print("-" * 70)

    finally:
        db.close()
        # pass


show_admin_data()