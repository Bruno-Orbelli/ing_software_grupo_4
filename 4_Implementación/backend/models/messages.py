from utils.utils import db, ma
from flask_restx import fields

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    likes = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user_data = db.relationship('User', backref='userData')
    create_at = db.Column(db.DateTime, server_default=db.func.now(), default=db.func.now())

    def getModel(messages):
        message_model = messages.model(
        "Message", {
            'id': fields.Integer(description='Message id'),
            'title': fields.String(description='Message title'),
            'content': fields.String(description='Message content'),
            'likes': fields.Integer(description='Message likes'),
            'user_id': fields.Integer(description='User id'),
            'user_data': fields.Nested({
                'fname': fields.String(description='User first name'),
                'lname': fields.String(description='User last name'),
                'uname': fields.String(description='User name'),
                'email': fields.String(description='User email')
            }),
            'create_at': fields.DateTime(description='Message creation date')
        })

        return message_model

    def __repr__(self):
        return f'<Message {self.title}>'