from utils.utils import db, ma
from marshmallow import fields
from models.messages import MessageSchema

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(150))
    lname = db.Column(db.String(150))
    uname = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    messages = db.relationship('Message', backref='user', lazy=True) # This is to get the messages of the user
    admin = db.Column(db.Boolean, default=False)

    def __init__(self, fname, lname, uname, email, password):
        self.fname = fname
        self.lname = lname
        self.uname = uname
        self.email = email
        self.password = password

    def __repr__(self):
        return f'<User {self.uname}>'

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'fname', 'lname', 'uname', 'email', 'password', 'messages', 'admin')

    # This is to get the messages of the user and serialize them so they can be returned in the response
    messages = fields.Nested('MessageSchema', many=True)