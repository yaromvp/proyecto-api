"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import SQLAlchemyError

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/user', methods=['POST'])
def create_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    #try:
        #validate_email(email)
    #except EmailNotValidError as e:
        #return jsonify({'message': 'Invalid email format', 'error': str(e)}), 400

    if '' in [email, password]:
        return jsonify({
            'message:': 'No value can be empty'
        }), 400

    if None in [email, password ]:
        return jsonify({
            'message:': 'Email and Password required'
        }), 400
    
    email_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()

    if email_exist:
        return jsonify({
            'message:': 'Unable to create user... try again'
        }), 400
    
    password_hash = generate_password_hash(password)
    new_user = User(email, password_hash)
    print(new_user.serialize())
    print(f"User created with ID: {new_user.id}")
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as error:
        db.session.rollback()  # Rollback en case of error
        print(f"Error creating user: {error}")  # Imprime el error específico
        return jsonify({
            'message': f'Database error: {str(error)}'
        }), 500

    return jsonify({
        'user: ': new_user.serialize()
    }), 200

@api.route('/token', methods=['POST'])
def login():
    # Validación de datos de entrada
    if not request.is_json:
        return jsonify({'message': 'Invalid request. JSON required'}), 400

    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Validación de campos requeridos
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    try:
        # Búsqueda de usuario
        email_exists = db.session.execute(db.select(User).filter_by(email=email)).first()

        # Validación de existencia de usuario
        if not email_exists:
            return jsonify({'message': 'Invalid email or password'}), 401

        # Extracción del usuario
        user = email_exists[0]

        # Verificación de contraseña
        if not check_password_hash(user.password, password):
            return jsonify({'message': 'Invalid email or password'}), 401

        # Generación de token
        token = create_access_token(identity=str(user.id))

        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email
            }
        }), 200
    
    except SQLAlchemyError as db_error:
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500
    
@api.route('/user', methods=['GET'])
@jwt_required()
def get_private_data():
    user_id = get_jwt_identity()
    print(f"User ID: {user_id}")
    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one()
    return jsonify(user.serialize()), 200
