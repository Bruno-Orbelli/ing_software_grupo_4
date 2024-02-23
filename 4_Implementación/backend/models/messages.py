from utils.utils import db, ma
from flask_restx import fields

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    likes = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_data = db.relationship('User', backref='userData')
    create_at = db.Column(db.DateTime, server_default=db.func.now(), default=db.func.now())

    def getModel(messages):
        message_model = messages.model(
        "Message", {
            'id': fields.Integer(description='Message id', skip_none=True),
            'title': fields.String(description='Message title', skip_none=True),
            'content': fields.String(description='Message content', skip_none=True),
            'likes': fields.Integer(description='Message likes', skip_none=True),
            'user_id': fields.Integer(description='User id', skip_none=True),
            'user_data': fields.Nested({
                'fname': fields.String(description='User first name', skip_none=True),
                'lname': fields.String(description='User last name', skip_none=True),
                'uname': fields.String(description='User name', skip_none=True),
                'email': fields.String(description='User email', skip_none=True)
            }, skip_none=True),
            'create_at': fields.DateTime(description='Message creation date', skip_none=True)
        })

        return message_model

    def __repr__(self):
        return f'<Message {self.title}>'