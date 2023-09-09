from flask import Blueprint, jsonify, request, Response, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, jwt_required
from models.users import User, UserSchema
from utils.utils import db, ma, jwt, cors

users = Blueprint('users', __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)

@users.route('/listUsers', methods=['GET'])
def listUsers():
    '''
    Method to list all users. GET request.
    '''
    try:
        users = User.query.all()
        return users_schema.jsonify(users, many=True), 200
    except Exception as e:
        return jsonify({'message': f'Error getting users: {e}'}), 500

@users.route('/getUser/<id>', methods=['GET'])
def getUser(id):
    '''
    Method to get a user by id. GET request.
    '''
    try:
        user = User.query.get(id)
        if user:
            return user_schema.jsonify(user), 200
        else:
            return jsonify({'message':'User does not exist'}), 404
    except Exception as e:
        return jsonify({'message':f'Error getting user: {e}'}), 500

@users.route('/updateUser/<id>', methods=['PUT'])
@jwt_required()
def updateUser(id):
    '''
    Method to update a user by id. PUT request.
    '''
    try:
        user = User.query.get(id)
        request_data = request.get_json()

        # Check if user exists
        if not user:
            return jsonify({'message': 'User does not exist'})

        fname = request_data['fname']
        lname = request_data['lname']
        uname = request_data['uname']
        email = request_data['email']
        password = request_data['password']

        user.fname = fname
        user.lname = lname
        user.uname = uname
        user.email = email
        user.password = generate_password_hash(password, method='sha256')

        db.session.commit()

        return jsonify({'message': f'User {user.uname} updated successfully'}), 201
    except Exception as e:
        return jsonify({'message': f'Error updating user: {e}'}), 500

@users.route('/deleteUser/<id>', methods=['DELETE'])
@jwt_required()
def deleteUser(id):
    try:
        user = User.query.get(id)

        # Check if user exists
        if not user:
            return jsonify({'message': 'User does not exist'})

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': f'User {user.uname} deleted'})
    except Exception as e:
        return jsonify({'message': f'Error deleting user: {e}'}), 500