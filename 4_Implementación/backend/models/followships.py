from utils.utils import db, ma
from flask_restx import fields

class Followship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def getModel(followships):
        followship_model = followships.model(
        "Followship", {
            'id': fields.Integer(description='Followship id', skip_none=True),
            'follower_id': fields.Integer(description='Follower user\'s id', skip_none=True),
            'followed_id': fields.Integer(description='Followed user\'s id', skip_none=True)
        })
            
        return followship_model

    def __repr__(self):
        return f'<Followship {self.id}, between users {self.follower_id} and {self.followed_id}>'