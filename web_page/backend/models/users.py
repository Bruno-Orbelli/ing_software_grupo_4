from utils.db import db
from utils.ma import ma

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(150))
    lname = db.Column(db.String(150))
    uname = db.Column(db.String(150))
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    admin = db.Column(db.Boolean, default=False)

    def __init__(self, fname, lname, uname, email, password):
        self.fname = fname
        self.lname = lname
        self.uname = uname
        self.email = email
        self.password = password

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'fname', 'lname', 'uname', 'email', 'password', 'admin')