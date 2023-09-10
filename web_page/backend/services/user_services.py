from flask import request
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, jwt_required
from flask_restx import Namespace, Resource
from models.users import User
from utils.utils import db, ma, jwt, cors

users = Namespace('users', description='Users endpoints namespace')

user_model = User.getModel(users)

@users.route('/users')
class UsersResource(Resource):
    @users.marshal_list_with(user_model)
    def get(self):
        '''
        Method to list all users. GET request.
        '''
        try:
            users = User.query.all()
            if users:
                return users, 200
            else:
                return users.abort(404, 'No users found')
        except Exception as e:
            if not users:
                return users.abort(404, 'No users found')
            return users.abort(500, f'Error getting users: {e}')

@users.route('/user/<id>')
class UserResources(Resource):
    @users.marshal_with(user_model)
    def get(self, id):
        '''
        Method to get a user by id. GET request.
        '''
        try:
            user = User.query.get(id)
            if user:
                return user, 200
            else:
                return users.abort(404, 'User does not exist')
        except Exception as e:
            if not user:
                return users.abort(404, 'User does not exist')
            return users.abort(500, f'Error getting user: {e}')
    
    @jwt_required()
    @users.marshal_with(user_model)
    def put(self, id):
        '''
        Method to update a user by id. PUT request.
        '''
        try:
            user = User.query.get(id)
            request_data = request.get_json()

            # Check if user exists
            if not user:
                return users.abort(404, 'User does not exist')

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

            return user, 200
        except Exception as e:
            if not user:
                return users.abort(404, 'User does not exist')
            return users.abort(500, f'Error updating user: {e}')
        
    @jwt_required()
    def delete(self, id):
        '''
        Method to delete a user by id. DELETE request.
        '''
        try:
            user = User.query.get(id)

            # Check if user exists
            if not user:
                return {'message': 'User does not exist'}, 404

            db.session.delete(user)
            db.session.commit()
            return {'message': f'User {user.uname} deleted'}, 200
        except Exception as e:
            return {'message': f'Error deleting user: {e}'}, 500

