from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import jwt
import auth
import validate

# init app
app = Flask(__name__)
CORS(app)
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
    first_name, last_name = request.json['firstName'], request.json['lastName']
    email, password = request.json['email'], request.json['password'] 
    is_teacher = request.json['isTeacher']  
    return auth.register(email, password, first_name, last_name, is_teacher)

@app.route('/login', methods=['POST'])
def login():
    email, password = request.json['email'], request.json['password']
    return auth.login(email, password)

@app.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization')
    return auth.logout(token)

@app.route('/courses', methods=['POST'])
def create_course():
    token = request.headers.get('Authorization')
    if not token:
        raise Unauthorized('Authorization token missing')
    user_id = validate.validate_token(token)
    name = request.json['name']
    
    #TODO: move this logic to courses
    existing_course = Course.query.filter_by(name=name).first()
    if existing_course:
        raise BadRequest('Course name already exists')

    new_course = Course(name=name)
    #TODO: set the creator = user_id
    db.session.add(new_course)
    db.session.commit()

    return jsonify({'message': 'Course created successfully', 'course_id': new_course.id}), 201

#TODO: add user not done yet
@app.route('/courses/<int:course_id>/invite', methods=['POST'])
def add_user(course_id):
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