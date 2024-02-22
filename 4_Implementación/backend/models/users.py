from utils.utils import db, ma
from marshmallow import fields, Schema
from models.messages import Message
from models.followships import Followship
from flask_restx import fields

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(150))
    lname = db.Column(db.String(150))
    uname = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    messages = db.relationship('Message', backref='user', lazy=True, cascade="all, delete-orphan") # This is to get the messages of the user
    followers = db.relationship('User', 
                                secondary=Followship.__table__.name, 
                                primaryjoin=id == Followship.__table__.c.followed_id,
                                secondaryjoin=id == Followship.__table__.c.follower_id,
                                back_populates='following',
                                cascade="all, delete"
                                ) # This is to get the followers of the user
    following = db.relationship('User',
                                secondary=Followship.__table__.name,
                                primaryjoin=id == Followship.__table__.c.follower_id,
                                secondaryjoin=id == Followship.__table__.c.followed_id,
                                back_populates='followers',
                                cascade="all, delete"
                                ) # This is to get the users followed by the original user
    admin = db.Column(db.Boolean, default=False)

    def getModel(users):
        message_model = Message.getModel(users)
        user_model = users.model(
        "User", {
            'id': fields.Integer(description='User id'),
            'fname': fields.String(description='User first name'),
            'lname': fields.String(description='User last name'),
            'uname': fields.String(description='User username'),
            'email': fields.String(description='User email'),
            'password': fields.String(description='User password'),
            'messages': fields.List(fields.Nested(message_model), description='User messages'),
            'admin': fields.Boolean(description='User admin status')
        })
        return user_model

    def __repr__(self):
        return f'<User {self.uname}>'

