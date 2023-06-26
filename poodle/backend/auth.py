from flask import jsonify
from models import User, UserSchema, db
from datetime import datetime, timedelta
from secrets import token_urlsafe
from variables import secret_key
import jwt

user_schema = UserSchema()
users_schema = UserSchema(many=True)

def register(email, password):
    if User.query.filter_by(email=email).first():
        return jsonify(message='Email already exists'), 409
    
    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return user_schema.jsonify(new_user), 200

def login(email, password):
    user = User.query.filter_by(email=email).first()

    if not user or user.password != password:
        return jsonify(message='Invalid email or password'), 401

    payload = {'user_email': user.email, 'exp': datetime.utcnow() + timedelta(minutes=30)}
    token = jwt.encode(payload, secret_key)

    return jsonify({'message': 'Login successful', 'token': token, 'user_id': user.id}), 200

def validate_token(token):
    payload = jwt.decode(token, secret_key)

    try:
        payload = jwt.decode(token, secret_key)
        return payload['user_email']
    except jwt.ExpiredSignatureError:
        return 'Token expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'


    # exp = payload['exp']
    # if datetime.utcnow() >= exp:
    #     return jsonify(message='Token expired. Please log in again.'), 401