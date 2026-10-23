from DBarchitecture.database import SessionLocal
from DBarchitecture import models


# from datetime import datetime, timezone

# now1 = datetime.now()
# now = datetime.now(timezone.utc)

# print(now)
# print(type(now))


def show_security_events():

    db = SessionLocal()

    try:
        loggedData = db.query(models.SecurityEvent).all()
        print("-" * 70)

        for data in loggedData:
            print(f"{data.id}  {data.event_type}  {data.username}  {data.ip_address}  {data.timestamp}  {data.details}")
            print("_" * 70)

    finally:
        db.close()

show_security_events()