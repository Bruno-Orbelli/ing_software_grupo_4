from flask import Flask
from os import path
from .routes import views
from services.user_services import users
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv
from database.db import db
import os

def create_app():

    load_dotenv()

    MYSQL_HOST = os.getenv('MYSQL_HOST')
    MYSQL_USER = os.getenv('MYSQL_USER')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')

    # Initialize Flask app
    app = Flask(__name__)
    app.config['SECRET_KEY'] = '2804'
    # Set conection for database
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:3306/{MYSQL_DATABASE}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Disable warnings

    db.init_app(app) # Initialize database

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(users, url_prefix='/')

    # Create database if not exists
    with app.app_context():
        db.create_all()
    
    return app