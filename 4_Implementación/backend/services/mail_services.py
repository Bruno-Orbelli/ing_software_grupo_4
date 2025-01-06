from flask import request, abort
from flask_jwt_extended import jwt_required, get_jwt
from flask_restx import Namespace, Resource
from werkzeug.exceptions import NotFound, Forbidden
from models.mailtemplates import MailTemplate
from utils.utils import mail
from flask_mail import Message
from models.users import User

mail_templates = Namespace('mailtemplates', description='MailTemplates endpoints namespace')

mail_model = MailTemplate.getModel(mail_templates)

@mail_templates.route('/mailtemplates')
class MailTemplatesResources(Resource):
    
    @mail_templates.marshal_list_with(mail_model, skip_none=True)
    @jwt_required()
    def get(self):
        '''
        Method to list all mail templates. GET request.
        Filter by:
        - description: string
        - subject: string
        - template: string
        '''
        try:
            # Check if token is not recovery and user is admin
            if not (get_jwt().get('recovery') != True and get_jwt().get('role')):
                return abort(403, "You are not allowed to access this resource.")
            
            mail_templates = MailTemplate.query
            # Get parameters from request to filter
            for key in request.args:
                if key == 'description':
                    mail_templates = mail_templates.filter(MailTemplate.description.like(f'%{request.args[key]}%'))
                elif key == 'subject':
                    mail_templates = mail_templates.filter(MailTemplate.subject.like(f'%{request.args[key]}%'))
                elif key == 'template':
                    mail_templates = mail_templates.filter(MailTemplate.template.like(f'%{request.args[key]}%'))
                
            if not mail_templates.all():
                return {}, 200
            else:
                return mail_templates.all(), 200
        except Exception as e:
            if isinstance(e, (NotFound, Forbidden)):
                raise e
            return abort(500, f'Error getting mail templates: \'{type(e)}: {e}\'.')

@mail_templates.route('/mailtemplate/<id>')
class MailTemplateResources(Resource):
    
    @mail_templates.marshal_with(mail_model, skip_none=True)
    @jwt_required()
    def get(self, id):
        '''
        Method to get a mail templtate by id. GET request.
        '''
        try:
            # Check if token is not recovery and user is admin
            if not (get_jwt().get('recovery') != True and get_jwt().get('role')):
                return abort(403, "You are not allowed to access this resource.")
            mail_template = MailTemplate.query.get(id)
            if not mail_template:
                return abort(404, f'Mail template does not exist.')
            else:
                return mail_template, 200
        except Exception as e:
            if isinstance(e, (NotFound, Forbidden)):
                raise e
            return abort(500, f'Error getting mail templates: \'{type(e)}: {e}\'.')

class MailService:
    @staticmethod
    def send_mail(to: str, template_id: int, **kwargs):
        '''
        Method to send a mail.
        '''
        try:
            # Get mail template
            mail_template = MailTemplate.query.get(template_id)
            if not mail_template:
                return abort(404, f'Mail template does not exist.')
            
            # Get user from email
            user = User.query.filter_by(email=to).first()
            if not user:
                return abort(404, f'User with specified email does not exist.')
            
            # Format mail template
            mail_body = mail_template.template.format(**kwargs)
            message = Message(subject=mail_template.subject, recipients=[to], html=mail_body)
            
            # Send mail
            mail.send(message)
            return {'message': f'Mail sent to {to}.'}, 200
        except Exception as e:
            return abort(500, f'Error sending mail: \'{type(e)}: {e}\'.')