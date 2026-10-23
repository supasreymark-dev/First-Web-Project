from pydantic import BaseModel


class AdminLogin(BaseModel):
    username: str
    password: str

class addIP(BaseModel):
    IP:str
    attempt:int

class ChangePass(BaseModel):
    username: str
    oldPassword: str
    newPassword: str

class UserCredentials(BaseModel):
    username: str
    password: str


class UpdateAccount(BaseModel):
    username: str
    password: str
    newUsername: str
    oldPassword: str
    newPassword: str
    confirmPass: str