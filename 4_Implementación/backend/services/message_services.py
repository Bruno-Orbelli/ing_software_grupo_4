from flask import request, abort
from flask_jwt_extended import jwt_required, get_jwt
from flask_restx import Namespace, Resource
from models.messages import Message
from utils.utils import db
from models.users import User

messages = Namespace('messages', description='Messages endpoints namespace')

message_model = Message.getModel(messages)

@messages.route('/messages')
class MessagesResources(Resource):
    @messages.marshal_list_with(message_model)
    @jwt_required()
    def get(self):
        '''
        Method to list all messages. GET request. This receive in body:
        - title: string
        - content: string
        '''
        try:
            messages = Message.query.all()
            # Get username from user_id
            if not messages:
                return messages.abort(404, 'No messages found')
            else:
                return messages, 200
        except Exception as e:
            return abort(500, f'Error getting messages: {e}')
        
    @messages.marshal_with(message_model)   
    @jwt_required()
    def post(self):
        '''
        Method to add a new message. POST request.
        '''
        try:
            ## Get data from request
            request_data = request.get_json()

            title = request_data['title']
            content = request_data['content']
            user_id = get_jwt().get('user_id')

            # Add message to database
            new_message = Message(
                title=title, 
                content=content, 
                user_id=user_id
                )
            
            db.session.add(new_message)
            db.session.commit()

            # Return success message
            return new_message, 201
        except Exception as e:
            # Rollback and return error message
            db.session.rollback()
            return abort(500, f'Error saving message: {e}')

@messages.route('/message/<id>')
class MessageResources(Resource):

    @messages.marshal_with(message_model)
    @jwt_required()
    def get(self, id):
        '''
        Method to get a message by id. GET request.
        '''
        try:
            message = Message.query.get(id)
            if message:
                return message, 200
            else:
                return abort(404, 'Message does not exist')
        except Exception as e:
            return abort(500, f'Error getting message: {e}')
        
    @messages.marshal_with(message_model)
    @jwt_required()
    def put(self, id):
        '''
        Method to update a message by id. PUT request.
        Users can only update messages they are authors of, unless they are admin.
        '''
        try:
            message = Message.query.get(id)
            # Check if message exists
            if not message:
                return abort(404, 'Message does not exist')
            
            # Check if user is the author of the message or is admin
            if not (message.user_id == get_jwt().get('user_id') or get_jwt().get('admin')):
                return abort(403, 'You are not allowed to modify this resource.')
            
            request_data = request.get_json()

            for key, value in request_data.items():
                setattr(message, key, value) if key in ("title", "content") and value else None

            db.session.commit()
            return message, 200
        
        except Exception as e:
            db.session.rollback()
            return abort(500, f'Error updating message: {e}')
        
    @jwt_required()
    def delete(self, id):
        '''
        Method to delete a message by id. DELETE request.
        '''
        try:
            message = Message.query.get(id)

            # Check if user exists
            if not message:
                return messages.abort(404, 'Message does not exist')
            
            # Check if user is the author of the message or is admin
            if not (message.user_id == get_jwt().get('user_id') or get_jwt().get('admin')):
                return abort(403, 'You are not allowed to modify this resource.')

            db.session.delete(message)
            db.session.commit()

            return {'message': f'Message {message.title} deleted'}, 204
        except Exception as e:
            return abort(500, f'Error deleting message: {e}')