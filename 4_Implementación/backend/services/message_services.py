from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource
from models.messages import Message
from utils.utils import db
from models.users import User

messages = Namespace('messages', description='Messages endpoints namespace')

message_model = Message.getModel(messages)

@messages.route('/messages')
class MessagesResources(Resource):
    @messages.marshal_list_with(message_model)
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
            if not messages:
                return messages.abort(404, 'No messages found')
            return messages.abort(500, f'Error getting messages: {e}')
        
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
            email = get_jwt_identity()

            # Get user id from database
            user_id = User.query.filter_by(email=email).first().id

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
            # Return error message
            return messages.abort(500, f'Error saving message: {e}')

@messages.route('/message/<id>')
class MessageResources(Resource):

    @messages.marshal_with(message_model)
    def get(self, id):
        '''
        Method to get a message by id. GET request.
        '''
        try:
            message = Message.query.get(id)
            if message:
                return message, 200
            else:
                return messages.abort(404, 'Message does not exist')
        except Exception as e:
            if not message:
                return messages.abort(404, 'Message does not exist')
            return messages.abort(500, f'Error getting message: {e}')
        
    @messages.marshal_with(message_model)
    @jwt_required()
    def put(self, id):
        '''
        Method to update a message by id. PUT request.
        '''
        try:
            message = Message.query.get(id)
            request_data = request.get_json()

            # Check if user exists
            if not message:
                return messages.abort(404, 'Message does not exist')

            try:
                title = request_data['title']
            except KeyError:
                title = None
            try:
                content = request_data['content']
            except KeyError:
                content = None

            if not title:
                title = message.title
                print(title)
            if not content:
                content = message.content

            message.title = title
            message.content = content

            db.session.commit()

            return message, 200
        except Exception as e:
            if not message:
                return messages.abort(404, 'Message does not exist')
            return messages.abort(500, f'Error updating message: {e}')
        
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

            db.session.delete(message)
            db.session.commit()

            return {'message': f'Message {message.title} deleted'}, 200
        except Exception as e:
            if not message:
                return messages.abort(404, 'Message does not exist')
            return messages.abort(500, f'Error deleting message: {e}')