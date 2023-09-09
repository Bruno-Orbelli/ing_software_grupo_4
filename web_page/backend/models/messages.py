from utils.utils import db, ma

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    likes = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, title, content, user_id):
        self.title = title
        self.content = content
        #self.likes = likes #! Ver tema de los likes
        self.user_id = user_id

    def __repr__(self):
        return f'<Message {self.title}>'

class MessageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'content', 'likes', 'user_id')