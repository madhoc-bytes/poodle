from flask import jsonify
from models import User, UserSchema, db
from datetime import datetime, timedelta
from secrets import token_urlsafe
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import jwt


user_schema = UserSchema()
users_schema = UserSchema(many=True)

def register(email, password):
    if User.query.filter_by(email=email).first():
        raise BadRequest('Email already exists')
    
    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return user_schema.jsonify(new_user), 200

def login(email, password):
    user = User.query.filter_by(email=email).first()

    if not user or user.password != password:
        raise Unauthorized('Invalid email or password')

    payload = {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(minutes=30)}
    token = jwt.encode(payload, secret_key, algorithm="HS256")

    return jsonify({'message': 'Login successful', 'token': token, 'user_id': user.id}), 200

def logout(token):
    if not token:
        raise Unauthorized('Authorization token missing')
    return jsonify({'message': 'Logout successful'}), 200

def validate_token(token):
    try:
        payload = jwt.decode(token, secret_key, algorithm=["HS256"])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        raise Unauthorized('Token has expired')
    except jwt.InvalidTokenError:
        raise Unauthorized('Invalid token')
