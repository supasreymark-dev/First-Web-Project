from .database import Base
from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime, timezone


class Admin(Base):
    __tablename__ = "Admin"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

class AdminSessions(Base):
    __tablename__ = "Admin Sessions"

    id = Column(String, primary_key=True)
    admin_id = Column(Integer, nullable=False)


class User(Base):
    __tablename__ = "Users Credentials"

    id = Column(Integer,primary_key=True, index=True)
    username = Column(String, unique=False, nullable=False)
    password = Column(String, nullable=False)
    hash_password = Column(String, nullable=False)


class UserSession(Base):
    __tablename__ = "User Sessions"

    id = Column(String, primary_key=True)
    user_id = Column(Integer, nullable=False)

# ==============================================================================
#             FOR SECURITY LOG ANALYZER DATABASE TABLE 
# ==============================================================================
class SecurityEvent(Base):
    __tablename__ = "Security_events"

    id = Column(Integer,primary_key=True, index=True)

    event_type = Column(String, nullable=False)
    username = Column(String, nullable=False)
    ip_address = Column(String, nullable=False)

    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    details = Column(String, nullable=True)

class IPAddress(Base):
    __tablename__ = "IP_Address"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, nullable=False)
    login_failed = Column(Integer, default=0, nullable=False)
    alerts = Column(String, default="Low", nullable=False)
    timestamp = Column(String, nullable=True)
    count_down = Column(DateTime(timezone=True), nullable=True)



class FlaggedIP(Base):
    __tablename__ = "Flagged_IPs"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, nullable=False)


# ==============================================================================
