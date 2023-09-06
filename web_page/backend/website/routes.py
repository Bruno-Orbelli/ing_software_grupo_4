from flask import Blueprint, jsonify, request, Response

views = Blueprint('views', __name__)

@views.route('/', methods=['GET'])
def home():
    return "<h1>Home</h1>"

@views.route('/login', methods=['GET', 'POST'])
def loginUser():
    return "<h1>Login</h1>"

@views.route('/register', methods=['GET', 'POST'])
def registerUser():
    return "<h1>Register</h1>"