# MY simple LOGIN/SIGNUP form project with Database and API integration

# STACKS USED

    **Frontend**
    ============
    - HTML       - creates the structure of the login/signup form.
    - CSS        - styles the frontend.
    - JavaScript - sends requests to the FastAPI backend and handles responses.


    **Backend**
    ============
    - FastAPI         - creates the API/endpoints [such as CREATE(post), READ(get), UPDATE(put), DELETE(delete)].
    - Uvicorn         - runs the FastAPI application.
    - Pydantic        - validates data received from the frontend.
    - SQLAlchemy      - allows Python code to communicate with the database using ORM.
    - psycopg[binary] - PostgreSQL database driver.
    - pwdlib[argon2]  - securely hashes passwords before storing them.


    **Database**
    ============
    - PostgreSQL - stores user information such as usernames and hashed passwords.

## First thing to do is to make a file

for example:

# frontEnd Folder

    index.html
    style.css
    script.js

# backEnd Folder

    main.py
    DBcommunication Folder
        - database.py
        - schemas.py
        - models.py

## Installation

        ------------------------------------------------
        Install the required packages for backEnd folder
        ------------------------------------------------

# 1. Go to or Navigate to backEnd folder using 'cd' command 'cd backEnd'

        The terminal should look like this  C:\Users\MyComputer\OneDrive..\..\..\backEnd>

# 2. Create a virtual environment using 'python -m venv virtualEnvironment' command where "virtualEnvironment" is the name of virtual environment you'll create

        ..\..\backEnd>  python -m venv virtualEnvironment

# 3. After successfully created the virtualEnvironment, activate it

        ..\..\backEnd>  virtualEnvironment\Scripts\activate

# 4. After activating it, install the required/needed packages for the project using 'python -m pip install' command

        THE LIST ARE:
        1. fastapi
        2. uvicorn
        3. pydantic
        4. sqlalchemy
        5. psycopg[binary]
        6. pwdlib[argon2]
        7. python-dotenv

        example :       ..\..\backEnd>    python -m pip install fastapi uvicorn pydantic sqlalchemy psycopg[binary] pwdlib[argon2]

# 5. Activating the local server

        example :       ..\..\backEnd>  uvicorn main:app --reload

        where uvicorn is the package that responsible for running the local server, 'main' is simply the name of the file 'main.py', 'app' is the name assigned to the FastAPI which you can see inside the 'main.py' code which look like app = FastAPI() and '--reload' is command to automatically reload/refresh the local server after every changes and saved happens in code or in developing.

## PACKAGES and THEIR DEFINITION and USES

---

# 1. fastapi

    - FastAPI is the Python framework used to create the backend API. FastAPI receives HTTP requests from the frontend and sends HTTP responses back.
    - Main purpose:
        Frontend
            ↓
        HTTP request
            ↓
        FastAPI
            ↓
        Python code
            ↓
        HTTP response
            ↓
        Frontend

# 2. uvicorn

    - Uvicorn is the server used to run the FastAPI application.
    - FastAPI creates the application, while Uvicorn actually runs the application so that it can receive HTTP requests.

# 3. pydantic

    - Pydantic is used for data validation and data parsing.
    - In this project, Pydantic is useful for defining what data the frontend is expected to send.

    example:
                from pydantic import BaseModel

                class CreateUser(BaseModel):
                    username: str
                    password: str

    This means FastAPI expects data similar to:

                {
                    "username": "John",
                    "password": "mypassword"
                }

    Pydantic checks that the expected fields exist and have the expected types.

# 4. sqlalchemy

    - SQLAlchemy is an ORM (Object Relational Mapper).
    - It allows Python code to interact with database tables using Python objects instead of manually writing SQL for every operation.
    - It maps:  Python Class                            Python Object
                    ↕                    and                 ↕
                Database Table                          Database Row

# 5. psycopg[binary]

    - psycopg is the PostgreSQL driver.
    - SQLAlchemy knows how to work with databases, but it still needs a PostgreSQL-specific driver to communicate with PostgreSQL.
    - example communication flow:       Python Code => SQLAlchemy => psycopg => PostgreSQL

# 6. pwdlib[argon2]

    - pwdlib is used for password hashing.
    - The Argon2 algorithm is used to securely hash passwords.
    - Passwords should not be stored as plain text.
    - During login, the submitted password is checked against the stored hash rather than comparing plain-text passwords.

## USING PACKAGES FUNCTIONS

---

1. for main.py file

# from fastapi import FastAPI, Depends, HTTPException

    - This line imports three things from FastAPI that are used in the backend.

    FastAPI - is used to create the actual FastAPI application. When I write app = FastAPI(), I am creating the application object that will contain my API endpoints, middleware, and other FastAPI configurations. In other words, FastAPI is the main class that allows me to build my backend API.

    Depends - is used for FastAPI's dependency injection system. In this project, I use it to provide a database session to my endpoint without having to manually create and close a database connection every time an endpoint is called. For example, when I write db: Session = Depends(get_db), I am telling FastAPI to call my get_db() function and provide the resulting database session to the db parameter.

    HTTPException - is used when I want to stop an endpoint because something went wrong and send an HTTP error response to the frontend. For example, if a username does not exist during login, I can use raise HTTPException(status_code=404, detail="Invalid username"). The raise statement immediately stops the function, and FastAPI converts the exception into an HTTP response that the frontend can receive.

# from fastapi.middleware.cors import CORSMiddleware

    - This line imports CORSMiddleware, which allows my FastAPI backend to control which other origins are allowed to communicate with it. This is important because my frontend and backend may be running on different addresses or ports during development. For example, my frontend might run on one port while FastAPI runs on port 8000. Without the appropriate CORS configuration, the browser may block the frontend from making requests to the backend. I add CORSMiddleware to my FastAPI application so that I can specify which origins, methods, headers, and credentials are allowed.

    example:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    This configuration is allowing requests from any origin, with any HTTP method and headers. This is convenient for development, but in a real production application I should normally specify the actual frontend origin instead of allowing everything.

# from sqlalchemy.orm import Session

    - This line imports SQLAlchemy's Session class. A Session is used to communicate with the database and perform database operations through SQLAlchemy. In my endpoints, I use it as a type annotation for the db variable, such as db: Session = Depends(get_db). This tells me and the code that the db variable is expected to contain a SQLAlchemy database session.

    - The session is what I use when I want to query the database, add a new object, commit changes, or refresh an object. For example, db.query(...) searches the database, while db.add(...) prepares a new object to be inserted.

2. for database.py file

# from sqlalchemy import create_engine

    - This line imports create_engine, which is used to create the SQLAlchemy engine. The engine is responsible for establishing the connection configuration between my Python application and the database. When I write engine = create_engine(DATABASE_URL), SQLAlchemy uses the database URL to know which database it should connect to and which database driver it should use.

    - The engine is essentially the starting point for SQLAlchemy's communication with PostgreSQL.   Python application => SQLAlchemy Engine => PostgreSQL

# from sqlalchemy.orm import sessionmaker, declarative_base

    - This line imports sessionmaker and declarative_base, which are used when setting up SQLAlchemy.

    sessionmaker - is used to create a factory for database sessions. For example, when I create SessionLocal = sessionmaker(...), I am creating something that I can call later with SessionLocal() to create an individual database session. That session is then used by my endpoints to perform database operations.

    declarative_base - is used to create the base class from which my SQLAlchemy models inherit. When I write Base = declarative_base(), I create a base class that SQLAlchemy uses to keep track of my database models. Later, when I create something such as class User(Base), SQLAlchemy knows that User is a database model and should be mapped to a database table.

3. for models.py

# from sqlalchemy import Column, Integer, String

    - This line imports the SQLAlchemy classes I need to describe the columns of my database table.

    Column - is used to define an individual column in a database table. For example, when I write username = Column(String), I am telling SQLAlchemy that the username attribute represents a column in the database table.

    Integer - tells SQLAlchemy that a column should contain integer values. It is commonly used for things such as an automatically generated user ID.
    For example, id = Column(Integer, primary_key=True) creates an integer column that can be used as the primary key.

    String - tells SQLAlchemy that a column is intended to store text. In this project, I use it for values such as the username and password hash.

    for example:
    class User(Base):
        __tablename__ = "users"

        id = Column(Integer, primary_key=True)
        username = Column(String)
        password = Column(String)

    This Python class represents a database table, and the Column, Integer, and String definitions describe the columns that table should contain.

4. for schemas.py

# from pydantic import BaseModel

    - This line imports Pydantic's BaseModel, which I use to create schemas for data validation.
    - When I create a class that inherits from BaseModel, Pydantic uses the fields I define in that class to determine what kind of data my API expects to receive.

    for example:
    class CreateUser(BaseModel):
        username: str
        password: str

    This tells FastAPI that a signup request should contain a username and password, and that both values should be strings.

    When the frontend sends JSON such as:
    {
        "username": "John",
        "password": "mypassword"
    }

    FastAPI uses the Pydantic schema to validate and parse that incoming data. After validation, I can access the values in Python using user.username and user.password.
    This is why Pydantic schemas are useful: they define and validate the structure of the data that enters or leaves my API.

## Now if the 'txt' file already created inside the root directory of backEnd named 'requirements.txt' and contained all the packages the project needs then install it using this command 'pip install -r requirements.txt' or 'python -m pip install -r requirements.txt' but still make sure that the virtualEnvironment of the project are already activated, it should look like this;

    (virtualEnvironment) C: \Users..\..\..\..\backEnd>  python -m pip install -r requirements.txt

### HOW DOES THE PROJECT WORKS?

=========The basic flow is:============
HTML FORM
↓
JavaScript
↓
HTTP REQUEST
↓
FastAPI ENDPOINT
↓
Pydantic Schema
↓
SQLAlchemy
↓
PostgreSQL
↓
SQLAlchemy
↓
FastAPI RESPONSE
↓
JavaScript
↓
HTML / UI

# for example, during signup:

User enters username + password
↓
JavaScript sends POST /signUp
↓
FastAPI receives the request
↓
Pydantic validates the data
↓
Password is hashed
↓
SQLAlchemy creates a User object
↓
PostgreSQL stores the user
↓
FastAPI returns a response
↓
JavaScript reads the response
