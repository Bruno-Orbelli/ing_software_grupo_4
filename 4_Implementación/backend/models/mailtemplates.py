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
            'id': fields.Integer(description='MailTemplate id'),
            'description': fields.String(description='MailTemplate description'),
            'subject': fields.String(description='MailTemplate subject'),
            'template': fields.String(description='MailTemplate body'),
        })

        return mail_template_model

    def __repr__(self):
        return f'<MailTemplate {self.id}, with description: {self.description}>'