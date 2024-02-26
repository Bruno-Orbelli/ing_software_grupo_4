from dotenv import load_dotenv
import os

class Config:
    '''
    Class to store all the configuration variables.
    '''

    load_dotenv()

    MYSQL_HOST = os.getenv('MYSQL_HOST')
    MYSQL_USER = os.getenv('MYSQL_USER')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')

    SECRET_KEY=os.getenv('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PORT = os.getenv('PORT')

    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT = os.getenv('MAIL_PORT')
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS')
    MAIL_USE_SSL = os.getenv('MAIL_USE_SSL')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')

class DevConfig(Config):
    '''
    Class to store all the configuration variables for development.
    This class inherits from Config class.
    '''
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f'mysql://{Config.MYSQL_USER}:{Config.MYSQL_PASSWORD}@{Config.MYSQL_HOST}:3306/{Config.MYSQL_DATABASE}'
    SQLALCHEMY_ECHO = False
