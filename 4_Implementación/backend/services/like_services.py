from flask import request, abort
from werkzeug.exceptions import NotFound, Forbidden
from flask_jwt_extended import jwt_required, get_jwt
from flask_restx import Namespace, Resource
from models.messages import Message
from models.users import User
from models.likes import Likes
from utils.utils import db

likes = Namespace('likes', description='Messages endpoints namespace')

likes_model = Likes.getModel(likes)

@likes.route('/likes/<int:message_id>')
class LikesResource(Resource):
    @likes.marshal_list_with(likes_model, skip_none=True)
    @jwt_required()
    #Verificar si el usuario ya dio 'like' a un mensaje
    def get(self, message_id):
        '''
        Method to list all likes of a message. GET request.
        '''
        try:
            # Check if token is not recovery
            if get_jwt().get('recovery') == True:
                return abort(403, 'You are not allowed to access this resource.')
            user_id = get_jwt().get('user_id')
            likes = Likes.query.filter_by(message_id=message_id, user_id=user_id)
            return likes.all(), 200
        except Exception as e:
            return abort(500, f'Error getting likes: \'{type(e)}: {e}\'.')

    @jwt_required()
    def post(self, message_id):
        """
        Agregar un 'like' a un mensaje.
        """
        # Obtener el ID del usuario desde el JWT
        user_id = get_jwt().get('user_id')

        # Verificar si el mensaje existe
        message = Message.query.get(message_id)
        if not message:
            abort(NotFound.code, "El mensaje no existe.")

        # Verificar si el usuario ya dio 'like'
        existing_like = Likes.query.filter_by(user_id=user_id, message_id=message_id).first()
        if existing_like:
            abort(Forbidden.code, "Ya has dado 'like' a este mensaje.")

        # Agregar el 'like'
        new_like = Likes(user_id=user_id, message_id=message_id)
        db.session.add(new_like)

        # Incrementar el contador de 'likes' del mensaje
        message = Message.query.get(message_id)
        message.likes += 1

        db.session.commit()

        return {"message": "Like agregado correctamente."}, 201

    @jwt_required()
    def delete(self, message_id):
        """
        Eliminar un 'like' de un mensaje.
        """
        # Obtener el ID del usuario desde el JWT
        user_id = get_jwt().get('user_id')

        if not user_id:
            abort(Forbidden.code, "Usuario no autenticado.")

        # Verificar si el mensaje existe
        message = Message.query.get(message_id)
        if not message:
            abort(NotFound.code, "El mensaje no existe.")

        # Verificar si el 'like' existe
        existing_like = Likes.query.filter_by(user_id=user_id, message_id=message_id).first()
        if not existing_like:
            abort(NotFound.code, "No has dado 'like' a este mensaje.")

        # Eliminar el 'like'
        db.session.delete(existing_like)
        message.likes -= 1
        db.session.commit()

        return {"message": "Like eliminado correctamente."}, 200
