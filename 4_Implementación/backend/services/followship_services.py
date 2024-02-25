from flask import request, abort
from flask_jwt_extended import jwt_required, get_jwt
from flask_restx import Namespace, Resource
from werkzeug.exceptions import NotFound, Forbidden, BadRequest

from models.followships import Followship
from utils.utils import db
from models.users import User

followships = Namespace('followships', description='Followships endpoints namespace')

followship_model = Followship.getModel(followships)

@followships.route('/followships')
class FollowshipsResource(Resource):
    
    @followships.marshal_with(followship_model, skip_none=True)
    @jwt_required()
    def get(self):
        '''
        Method to list all followships. GET request.
        Filter by (only if admin):
        - follower_id: integer
        - followed_id: integer
        '''
        try:
            # Check if token is not recovery
            if get_jwt().get('recovery') == True:
                return abort(403, 'You are not allowed to access this resource.')
            
            followships = Followship.query
            if not get_jwt().get('role'):
                followships = followships.filter_by(follower_id=get_jwt().get('user_id'))  # Get user's followships from id
            else:
                # If admin, allow for filtering
                for key in request.args:
                    if key == 'follower_id':
                        followships = followships.filter(Followship.follower_id == int(request.args[key]))
                        print(request.args[key])
                    elif key == 'followed_id':
                        followships = followships.filter(Followship.followed_id == int(request.args[key]))
            
            if not followships.all():
                return {}, 200
            else:
                return followships.all(), 200
        except Exception as e:
            return abort(500, f'Error getting followships: \'{type(e)}: {e}\'.')
        
    @followships.marshal_with(followship_model, skip_none=True)
    @jwt_required()   
    def post(self):
        '''
        Method to add a new followship. POST request.
        '''
        try:
            # Check if token is not recovery
            if get_jwt().get('recovery') == True:
                return abort(403, 'You are not allowed to create this resource.')
            
            # Get data from request
            request_data = request.get_json()

            follower_id = get_jwt().get('user_id')
            followed_id = request_data['followed_id']

            if followed_id == follower_id:
                return abort(400, 'You cannot follow yourself.')

            # Add followship to database
            new_followship = Followship( 
                follower_id=follower_id,
                followed_id=followed_id
            )
            
            db.session.add(new_followship)
            db.session.commit()

            # Return success message
            return new_followship, 201
        except Exception as e:
            # Return error message
            db.session.rollback()
            if isinstance(e, BadRequest):
                raise e
            return abort(500, f'Error following user: \'{type(e)}: {e}\'.')

@followships.route('/followship/<id>')
class FollowshipsResource(Resource):

    @followships.marshal_with(followship_model, skip_none=True)
    @jwt_required()
    def get(self, id):
        '''
        Method to get a followship by id. GET request.
        Users can only get followships they are part of, unless they are admin.
        '''
        try:
            user_id = get_jwt().get('user_id')
            followship = Followship.query.get(id)
            
            # Check if token is not recovery
            if get_jwt().get('recovery') == True:
                return abort(403, 'You are not allowed to access this resource.')
            
            if not followship:
                return abort(404, 'Followship does not exist.')
            
            # Check if user is part of followship or is admin
            if user_id not in (followship.follower_id, followship.followed_id) and not get_jwt().get('role'):
                return abort(403, 'You are not allowed to access this resource.')
            else:
                return followship, 200
        except Exception as e:
            if isinstance(e, (NotFound, Forbidden)):
                raise e
            return abort(500, f'Error getting followship: \'{type(e)}: {e}\'.')
        
    @jwt_required()
    def delete(self, id):
        '''
        Method to delete a followship by id. DELETE request.
        '''
        try:
            user_id = get_jwt().get('user_id')
            followship = Followship.query.get(id)

            # Check if token is not recovery
            if get_jwt().get('recovery') == True:
                return abort(403, 'You are not allowed to delete this resource.')
            
            # Check if followship exists
            if not followship:
                return abort(404, 'Followship does not exist.')
            
            # Check if user is part of followship or is admin
            if not(user_id in (followship.follower_id, followship.followed_id) or get_jwt().get('role')):
                return abort(403, 'You are not allowed to delete this resource.')
            else:
                db.session.delete(followship)
                db.session.commit()
                return {'message': f'Followship successfully deleted.'}, 204
        
        except Exception as e:
            db.session.rollback()
            if isinstance(e, (NotFound, Forbidden)):
                raise e
            return abort(500, f'Error deleting followship: \'{type(e)}: {e}\'.')