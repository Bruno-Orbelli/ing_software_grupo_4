from flask import Blueprint, jsonify, request, Response, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, jwt_required
from flask_marshmallow import Marshmallow
from models.messages import Message, MessageSchema
from utils.utils import db
from models.users import User, UserSchema

messages = Blueprint('messages', __name__)
message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)

@messages.route('/saveMessage', methods=['POST'])
@jwt_required()
def saveMessage():
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

        print('Message saved!')
        # Return success message
        return jsonify({'message': 'Message saved!'}), 201
    except Exception as e:
        # Return error message
        return jsonify({'message': f'Error saving message: {e}'}), 500

@messages.route('/listMessages', methods=['GET'])
def listMessages():
    try:
        messages = Message.query.all()
        if messages:
            return messages_schema.jsonify(messages, many=True)
        else:
            return jsonify({'message': 'No messages found'}), 404
    except Exception as e:
        return jsonify({'message': f'Error getting messages: {e}'}), 500

@messages.route('/message/<id>', methods=['GET'])
def getMessage(id):
    try:
        message = Message.query.get(id)
        return message_schema.jsonify(message), 200
    except Exception as e:
        return jsonify({'message': f'Error getting message: {e}'}), 500

@messages.route('/editMessage/<id>', methods=['PUT'])
@jwt_required()
def editMessage(id):
    try:
        message = Message.query.get(id)
        request_data = request.get_json()

        # Check if user exists
        if not message:
            return jsonify({'message': 'Message does not exist'}), 404

        title = request_data['title']
        content = request_data['content']

        message.title = title
        message.content = content

        db.session.commit()

        return message_schema.jsonify(message), 200
    except Exception as e:
        return jsonify({'message': f'Error updating message: {e}'}), 500

@messages.route('/deleteMessage/<id>', methods=['DELETE'])
@jwt_required()
def deleteMessage(id):
    try:
        message = Message.query.get(id)

        # Check if user exists
        if not message:
            return jsonify({'message': f'Message with id {id} does not exist'}), 404

        db.session.delete(message)
        db.session.commit()

        return jsonify({'message': f'Message {message.title} deleted'}), 200
    except Exception as e:
        return jsonify({'message': f'Error deleting message: {e}'}), 500