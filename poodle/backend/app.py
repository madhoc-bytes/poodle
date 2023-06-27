from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import jwt
import auth

# init app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

# init db
from models import User, UserSchema, Course, db, ma # DON'T MOVE THIS LINE
db.init_app(app)
ma.init_app(app)
with app.app_context():
    db.create_all()

# Error Handling
@app.errorhandler(BadRequest)
def handle_bad_request(e):
    response = jsonify({'message': 'Bad request', 'error': str(e)})
    response.status_code = e.code
    return response

@app.errorhandler(Unauthorized)
def handle_unauthorized(e):
    response = jsonify({'message': 'Unauthorized', 'error': str(e)})
    response.status_code = e.code
    return response

@app.errorhandler(NotFound)
def handle_not_found(e):
    response = jsonify({'message': 'Not found', 'error': str(e)})
    response.status_code = e.code
    return response

# app decorators
@app.route('/register', methods=['POST'])
def register():
    email,password = request.json['email'], request.json['password']
    return auth.register(email, password)

@app.route('/login', methods=['POST'])
def login():
    email,password = request.json['email'], request.json['password']
    return auth.login(email, password)

@app.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization')
    return auth.logout(token)

@app.route('/courses', methods=['POST'])
def create_course():
    token = request.headers.get('Authorization')
    user_id = auth.validate_token(token)

    name = request.json['name']

    existing_course = Course.query.filter_by(name=name).first()
    if existing_course:
        raise BadRequest('Course name already exists')

    new_course = Course(name=name)
    #TODO: set the creator = user_id
    db.session.add(new_course)
    db.session.commit()

    return jsonify({'message': 'Course created successfully', 'course_id': new_course.id}), 201

@app.route('/courses/<int:course_id>/join', methods=['POST'])
def join_course(course_id):
    token = request.headers.get('Authorization')
    user_id = auth.validate_token(token)

    user = User.query.get(user_id)
    if not user:
        raise NotFound('User not found')
    
    course = Course.query.get(course_id)
    if not course:
        raise NotFound('Course not found')
    
    if course in user.courses:
        raise BadRequest('User is already enrolled in the course')
    
    user.courses.append(course)
    db.session.commit()

    return jsonify({'message': 'User enrolled in the course successfully'}), 200   


if __name__ == '__main__':
    app.run(debug=True)