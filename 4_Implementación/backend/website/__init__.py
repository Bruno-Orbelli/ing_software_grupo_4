from flask import Flask
from services.user_services import users
from services.message_services import messages
from auth.auth import auth
from utils.utils import db, ma, cors, jwt
from flask_restx import Api

def create_app(config):

    # Initialize Flask app
    app = Flask(__name__)
    app.config.from_object(config)

    # Initialize services
    db.init_app(app) # Initialize database
    ma.init_app(app) # Initialize Marshmallow
    cors.init_app(app) # Initialize CORS
    jwt.init_app(app) # Initialize JWT
    api = Api(app, doc='/docs')

    # Register namespaces
    api.add_namespace(users)
    api.add_namespace(messages)
    api.add_namespace(auth)

    # Create database if not exists
    with app.app_context():
        db.create_all()

    return app