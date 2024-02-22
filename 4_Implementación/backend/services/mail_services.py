from flask import request, abort
from flask_jwt_extended import jwt_required, get_jwt
from flask_restx import Namespace, Resource
from models.mailtemplates import MailTemplate
from utils.utils import db
from models.users import User

mail_templates = Namespace('mailtemplates', description='MailTemplates endpoints namespace')

mail_model = MailTemplate.getModel(mail_templates)

@mail_templates.route('/mailtemplates')
class MailTemplateResources(Resource):
    
    @mail_templates.marshal_list_with(mail_model)
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
            if not get_jwt().get('admin'):
                return abort(403, 'You are not allowed to access this resource.')
            mail_templates = MailTemplate.query
            # Get parameters from request to filter
            for key in request.args:
                mail_templates.filter(getattr(MailTemplate, key).like(f'%{request.args[key]}%')) if key in ('description', 'subject', 'template') else None
            if not mail_templates.all():
                return abort(404, 'No mail templates found.')
            else:
                return mail_templates.all(), 200
        except Exception as e:
            return abort(500, f'Error getting mail templates: {e}.')

@mail_templates.route('/mailtemplate/<id>')
class MessageResources(Resource):
    
    @mail_templates.marshal_with(mail_model)
    @jwt_required()
    def get(self, id):
        '''
        Method to get a mail templtate by id. GET request.
        '''
        try:
            if not get_jwt().get('admin'):
                return abort(403, 'You are not allowed to access this resource.')
            mail_template = MailTemplate.query.get(id)
            if not mail_template:
                return abort(404, 'Mail template does not exist')
            else:
                return mail_template, 200
        except Exception as e:
            return abort(500, f'Error getting mail templates: {e}')