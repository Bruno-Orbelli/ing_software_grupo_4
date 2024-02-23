from flask import request, abort
from werkzeug.security import generate_password_hash
from werkzeug.exceptions import NotFound, Forbidden
from flask_jwt_extended import jwt_required, get_jwt
from flask_restx import Namespace, Resource
from models.users import User
from utils.utils import db, ma, jwt, cors

users = Namespace('users', description='Users endpoints namespace')

user_model = User.getModel(users)

@users.route('/users')
class UsersResource(Resource):
    
    @jwt_required()
    @users.marshal_list_with(user_model, skip_none=True)
    def get(self):
        '''
        Method to list all users. GET request.
        '''
        try:
            users = User.query
            is_admin = get_jwt().get('role')
            allowed_filters = ('fname', 'lname', 'uname', 'email') if not is_admin else ('fname', 'lname', 'uname', 'email', 'admin')
            
            # Get parameters from request to filter
            for key in request.args:
                if key not in allowed_filters:
                    pass
                if key == 'fname':
                    users = users.filter(User.fname.like(f'%{request.args[key]}%'))
                elif key == 'lname':
                    users = users.filter(User.lname.like(f'%{request.args[key]}%'))
                elif key == 'uname':
                    users = users.filter(User.uname.like(f'%{request.args[key]}%'))
                elif key == 'email':
                    users = users.filter(User.email.like(f'%{request.args[key]}%'))
                elif key == 'admin':
                    users = users.filter(User.admin == int(request.args[key]))
            
            if not users.all():
                return {}, 200
            else:
                return users.all(), 200
        except Exception as e:
            return abort(500, f'Error getting users: \'{type(e)}: {e}\'.')

@users.route('/user/<id>')
class UserResources(Resource):
    
    @jwt_required()
    @users.marshal_with(user_model, skip_none=True)
    def get(self, id):
        '''
        Method to get a user by id. GET request.
        '''
        try:
            user = User.query.get(id)
            if user:
                return user, 200
            else:
                return abort(404, 'User does not exist.')
        except Exception as e:
            if isinstance(e, NotFound):
                raise e
            return abort(500, f'Error getting user: \'{type(e)}: {e}\'.')
    
    @jwt_required()
    @users.marshal_with(user_model, skip_none=True)
    def put(self, id):
        '''
        Method to update a user by id. PUT request.
        '''
        try:
            user = User.query.get(id)

            # Check if user exists
            if not user:
                return abort(404, 'User does not exist.')
            
            # Check if userId is the same as the one in the token or is admin
            if not (id == get_jwt().get('user_id') or get_jwt().get('role')):
                return abort(403, 'You are not allowed to modify this resource.')

            request_data = request.get_json()
            
            # Update user
            for key, value in request_data.items():
                # Check if password is different
                if key == "password":
                    value = generate_password_hash(value, method='pbkdf2')
                    if value == user.password:
                        value = None
                setattr(user, key, value) if key in ("fname", "lname", "uname", "email", "password") and value else None

            db.session.commit()
            return user, 200
        
        except Exception as e:
            db.session.rollback()
            if isinstance(e, (NotFound, Forbidden)):
                raise e
            return abort(500, f'Error updating user: \'{type(e)}: {e}\'.')
        
    @jwt_required()
    def delete(self, id):
        '''
        Method to delete a user by id. DELETE request.
        '''
        try:
            user = User.query.get(id)

            # Check if user exists
            if not user:
                return abort(404, 'User does not exist.')
            
            # Check if userId is the same as the one in the token or is admin
            if not (id == get_jwt().get('user_id') or get_jwt().get('role')):
                return abort(403, 'You are not allowed to delete this resource.')

            db.session.delete(user)
            db.session.commit()
            return {'message': f'User {user.uname} deleted.'}, 204
        except Exception as e:
            db.session.rollback()
            if isinstance(e, (NotFound, Forbidden)):
                raise e
            return abort(500, f'Error deleting user: \'{type(e)}: {e}\'.')

