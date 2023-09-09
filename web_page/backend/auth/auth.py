from flask import Blueprint, jsonify, request, Response, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, jwt_required
from models.users import User, UserSchema
from utils.utils import db, ma, jwt, cors

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def registerUser():
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
            return jsonify({'message': f'Email {user_mail} already exists'}), 400
        if db_uname:
            return jsonify({'message': f'Username {user_uname} already exists'}), 400

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
        return jsonify({'message': f'User {new_user.uname} created successfully'}), 201
    except:
        return jsonify({'message': 'Error creating user'}), 500

@auth.route('/login', methods=['POST'])
def loginUser():
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
                access_token = create_access_token(identity=db_user.email)
                # Create refresh token, this token is used to refresh the access token.
                refresh_token = create_refresh_token(identity=db_user.email)

                return jsonify({
                    'message': f'User {db_user.uname} logged in successfully',
                    'access_token': access_token,
                    'refresh_token': refresh_token
                }), 200
            else:
                return jsonify({'message':'Password is incorrect'}), 401
        else:
            return jsonify({'message':'User does not exist'}), 404
    except Exception as e:
        return jsonify({'message': f'Error login user: {e}'}), 500