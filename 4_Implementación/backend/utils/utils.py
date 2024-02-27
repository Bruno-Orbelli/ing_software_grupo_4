from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from auth.blacklist import RecoveryBlacklist

db = SQLAlchemy()
ma = Marshmallow()
cors = CORS()
jwt = JWTManager()
mail = Mail()
recovery_blist = RecoveryBlacklist()