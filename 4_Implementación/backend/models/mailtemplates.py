from utils.utils import db, ma
from flask_restx import fields

class MailTemplate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(150))
    subject = db.Column(db.String(150), nullable=False)
    template = db.Column(db.String(500), nullable=False)

    def getModel(mail_templates):
        mail_template_model = mail_templates.model(
        "MailTemplate", {
            'id': fields.Integer(description='MailTemplate id', skip_none=True),
            'description': fields.String(description='MailTemplate description', skip_none=True),
            'subject': fields.String(description='MailTemplate subject', skip_none=True),
            'template': fields.String(description='MailTemplate body', skip_none=True),
        })

        return mail_template_model

    def __repr__(self):
        return f'<MailTemplate {self.id}, with description: {self.description}>'