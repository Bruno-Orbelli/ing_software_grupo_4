from flask import Blueprint, jsonify, request, Response, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from flask_marshmallow import Marshmallow
from models.users import User, UserSchema
from utils.db import db

users = Blueprint('users', __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)

@users.route('/registerUser', methods=['POST'])
def registerUser():
    ## Get data from form
    # fname = request.form.get('fname')
    # lname = request.form.get('lname')
    # uname = request.form.get('uname')
    # email = request.form.get('email')
    # password1 = request.form.get('password')
    # password2 = request.form.get('password2')

    ## Get data from request
    request_data = request.get_json()
    fname = request_data['fname']
    lname = request_data['lname']
    uname = request_data['uname']
    email = request_data['email']
    password1 = request_data['password1']
    password2 = request_data['password2']

    #print(fname, lname, uname, email, password1, password2)

    # Check if user email and username already exists
    user_mail = User.query.filter_by(email=email).first()
    user_uname = User.query.filter_by(uname=uname).first()

    # Set conditions for register user
    if user_mail:
        flash('Email already exists', category='error')
    elif user_uname:
        flash('Username already exists', category='error')
    elif len(email) < 4:
        flash('Email must be greater than 3 characters', category='error')
    elif len(fname) < 2:
        flash('First name must be greater than 1 character', category='error')
    elif len(lname) < 2:
        flash('Last name must be greater than 1 character', category='error')
    elif len(uname) < 2:
        flash('Username must be greater than 1 character', category='error')
    elif len(password1) < 7 or len(password2) < 7:
        flash('Password must be at least 7 characters', category='error')
    elif password1 != password2:
        flash('Passwords don\'t match', category='error')
    else:
        # Add user to database
        new_user = User(fname=fname, lname=lname, uname=uname, email=email, password=generate_password_hash(password1, method='sha256'))
        db.session.add(new_user)
        db.session.commit()
        flash('Account created!', category='success')
        # Redirect to home page #! Change this to redirect to login page
        return user_schema.jsonify(new_user)

@users.route('/loginUser', methods=['POST'])
def loginUser():
    ## Get data from form
    # email = request.form.get('email')
    # password = request.form.get('password')

    ## Get data from request
    request_data = request.get_json()
    email = request_data['email']
    password = request_data['password']

    # Check if user exists
    user = User.query.filter_by(email=email).first()

    # Set conditions for login user
    if user:
        if check_password_hash(user.password, password):
            flash('Logged in successfully!', category='success')
            #login_user(user, remember=True) # Remember user session sets a cookie
            return jsonify({'success': True}) #! Change this to redirect to home page
        else:
            flash('Incorrect password, try again.', category='error')
    else:
        flash('Username does not exist.', category='error')
    
    return jsonify({'success': False})

@users.route('/logoutUser', methods=['POST'])
@login_required
def logoutUser():
    logout_user()
    return jsonify({'success': True}) #! Change this to redirect to login page

@users.route('/listUsers', methods=['GET'])
def listUsers():
    users = User.query.all()
    return users_schema.jsonify(users, many=True)

@users.route('/getUser/<id>', methods=['GET'])
def getUser(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)

@users.route('/updateUser/<id>', methods=['PUT'])
def updateUser(id):
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

    return user_schema.jsonify(user)

@users.route('/deleteUser/<id>', methods=['DELETE'])
def deleteUser(id):
    user = User.query.get(id)

    # Check if user exists
    if not user:
        return jsonify({'message': 'User does not exist'})

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': f'User {user.uname} deleted'})