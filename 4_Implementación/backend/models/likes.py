from utils.utils import db, ma
from flask_restx import fields

class Likes(db.Model):
    __tablename__ = 'likes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message_id = db.Column(db.Integer, db.ForeignKey('message.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def getModel(likes):
        like_model = likes.model(
        "Like", {
            'id': fields.Integer(description='Like id', skip_none=True),
            'user_id': fields.Integer(description='User id', skip_none=True),
            'message_id': fields.Integer(description='Message id', skip_none=True),
            'created_at': fields.DateTime(description='Like creation date', skip_none=True)
        })

        return like_model

    def __repr__(self):
        return f'<Like user_id={self.user_id} message_id={self.message_id}>'
