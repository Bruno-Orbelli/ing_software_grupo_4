from datetime import timedelta
from flask import jsonify, request, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, decode_token
from jwt.exceptions import InvalidSignatureError
from models.users import User
from flask_restx import Namespace, Resource
from utils.utils import db, ma, jwt, cors
from services.mail_services import MailService

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
                return {'message': f'Email {user_mail} already exists.'}, 400
            if db_uname:
                return {'message': f'Username {user_uname} already exists.'}, 400

            new_user = User(
                fname=request_data['fname'],
                lname=request_data['lname'],
                uname=request_data['uname'],
                email=request_data['email'],
                password=generate_password_hash(request_data['password1'], method='pbkdf2')
            )

            # Add user to database
            db.session.add(new_user)
            db.session.commit()
            print('User added to database')

            # Rerturn success message
            #return user_schema.jsonify(new_user), 201
            return {'message': f'User {new_user.uname} created successfully.'}, 201
        except Exception as e:
            db.session.rollback()
            if isinstance(e, KeyError):
                return {'message': 'Invalid request body.'}, 400
            return {'message': f'Error creating user: \'{type(e)}: {e}\'.'}, 500

@auth.route('/login')
class LoginUser(Resource):
    def post(self):
        '''
        Method to login a user. POST request.
        '''
        try:
            # Get data from request
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
                        'message': f'User {db_user.uname} logged in successfully.',
                        'access_token': access_token,
                        'refresh_token': refresh_token
                    }, 200
                else:
                    return {'message':'Password is incorrect.'}, 401
            else:
                return {'message':'User does not exist.'}, 404
        except Exception as e:
            if isinstance(e, KeyError):
                return {'message': 'Invalid request body.'}, 400
            return {'message': f'Error login user: \'{type(e)}: {e}\'.'}, 500
    
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
            if isinstance(e, KeyError):
                return {'message': 'Invalid request body.'}, 400
            return {'message': f'Error refreshing token: \'{type(e)}: {e}\'.'}, 500

@auth.route('/recovery/send_token')
class SendRecoveryToken(Resource):
    def post(self):
        '''
        Method to generate a recovery token for password changing and send it via email. POST request.
        '''
        try:
            # Get token from request
            request_data = request.get_json()
            token = request_data['requesting_token']
            
            # Get the identity of the sollicitor from the recovery token
            email = decode_token(token)['sub']
            user_id = decode_token(token)['user_id']

            # Check if identity is valid
            user = User.query.get(user_id)
            if not user:
                return {'message': 'User does not exist.'}, 404
            if user.email != email:
                return {'message': 'Invalid recovery token.'}, 400

            # Create the recovery token
            recovery_token = create_access_token(identity=email, 
                                                 additional_claims={'recovery': True}, 
                                                 expires_delta=timedelta(minutes=10))
            
            # Send recovery mail
            MailService.send_mail(email, 1, uname=user.uname, recovery_token=recovery_token)

            return {'message': 'Recovery mail sent correctly.'}, 200
        except Exception as e:
            if isinstance(e, KeyError):
                return {'message': 'Invalid request body.'}, 400
            elif isinstance(e, InvalidSignatureError):
                return {'message': 'Invalid requesting token.'}, 400
            return {'message': f'Error providing recovery token: \'{type(e)}: {e}\'.'}, 500

@auth.route('/recovery/<token>')
class CheckRecoveryToken(Resource):
    def get(self, token):
        '''
        Method to check if recovery token is valid. GET request.
        '''
        try:
            # Check if token is valid
            jwt_content = decode_token(token)
            print(jwt_content)
            if not jwt_content['recovery']:
                return {'is_valid': False}, 200

            return {'is_valid': True}, 200
        
        except (InvalidSignatureError, KeyError):
            return {'is_valid': False}, 200