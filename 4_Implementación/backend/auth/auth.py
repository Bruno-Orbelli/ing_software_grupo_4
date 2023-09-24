from datetime import timedelta
from flask import jsonify, request, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, jwt_required
from models.users import User
from flask_restx import Namespace, Resource
from utils.utils import db, ma, jwt, cors

auth = Namespace('auth', description='Authentication endpoints namespace')

@auth.route('/register')
class RegisterUser(Resource):
    def post(self):
        '''
        Method to register a new user. POST request.
        '''
        try:
            ## Get data from request
            request_data = request.get_json()

            # Check if username or email already exists
            user_mail = request_data['email']
            user_uname = request_data['uname']

            db_mail = User.query.filter_by(email=user_mail).first()
            db_uname = User.query.filter_by(uname=user_uname).first()

            if db_mail:
                return {'message': f'Email {user_mail} already exists'}, 400
            if db_uname:
                return {'message': f'Username {user_uname} already exists'}, 400

            new_user = User(
                fname=request_data['fname'],
                lname=request_data['lname'],
                uname=request_data['uname'],
                email=request_data['email'],
                password=generate_password_hash(request_data['password1'], method='sha256')
            )

            # Add user to database
            db.session.add(new_user)
            db.session.commit()
            print('User added to database')

            # Rerturn success message
            #return user_schema.jsonify(new_user), 201
            return {'message': f'User {new_user.uname} created successfully'}, 201
        except Exception as e:
            return {'message': f'Error creating user: {e}'}, 500

@auth.route('/login')
class LoginUser(Resource):
    def post(self):
        '''
        Method to login a user. POST request.
        '''
        try:
            ## Get data from request
            request_data = request.get_json()

            email = request_data['email']
            password = request_data['password']

            # Check if user exists
            db_user = User.query.filter_by(email=email).first()

            # Set conditions for login user
            if db_user:
                if check_password_hash(db_user.password, password):
                    # Create access token, this token is used to access the protected endpoints of our API.
                    access_token = create_access_token(identity=db_user.email, additional_claims={'role': db_user.admin, 'user_id': db_user.id}, expires_delta=timedelta(minutes=30))
                    # Create refresh token, this token is used to refresh the access token.
                    refresh_token = create_refresh_token(identity=db_user.email, expires_delta=timedelta(minutes=30))

                    return {
                        'message': f'User {db_user.uname} logged in successfully',
                        'access_token': access_token,
                        'refresh_token': refresh_token
                    }, 200
                else:
                    return {'message':'Password is incorrect'}, 401
            else:
                return {'message':'User does not exist'}, 404
        except Exception as e:
            return {'message': f'Error login user: {e}'}, 500
    
@auth.route('/refresh')
class RefreshToken(Resource):
    @jwt_required(refresh=True) # refresh=True indicates that this endpoint is for refreshing tokens only
    def post(self):
        '''
        Method to refresh the access token. POST request.
        '''
        try:
            # Get the identity of the current user from the access token
            current_user = get_jwt_identity()

            # Create the access token
            access_token = create_access_token(identity=current_user, expires_delta=timedelta(minutes=30))

            return {'access_token': access_token}, 200
        except Exception as e:
            return {'message': f'Error refreshing token: {e}'}, 500