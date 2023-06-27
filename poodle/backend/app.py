from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import jwt
import auth
import courses
import validate

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
	first_name, last_name = request.json['first_name'], request.json['last_name']
	email, password = request.json['email'], request.json['password'] 
	is_teacher = request.json['is_teacher']  
	return auth.register(email, password, first_name, last_name, is_teacher)

@app.route('/login', methods=['POST'])
def login():
	email, password = request.json['email'], request.json['password']
	return auth.login(email, password)

@app.route('/logout', methods=['POST'])
def logout():
	token = request.headers.get('Authorization')
	return auth.logout(token)

@app.route('/dashboard', methods=['POST'])
def fetch_courses():
	token = request.headers.get('Authorization')

	if not token:
		raise Unauthorized('Authorization token missing')
	
	email = request.json['email']
	
	return courses.fetch_courses(email)

@app.route('/courses', methods=['POST'])
def create_course():
	token = request.headers.get('Authorization')

	if not token:
		raise Unauthorized('Authorization token missing')
	
	user_id = validate.validate_token(token)
	name = request.json['name']
	
	return courses.create(name, user_id)

@app.route('/courses/<int:course_id>/invite', methods=['POST'])
def add_user():
	token = request.headers.get('Authorization')
	
	if not token:
		raise Unauthorized('Authorization token missing')
	
	user_id = validate.validate_token(token)
	course_id = request.json['course_id']
	student_email = request.json['email']

	return courses.invite(user_id, course_id, student_email) 

@app.route('/courses/<int:course_id>/students', methods=['POST'])
def all_students():
	token = request.headers.get('Authorization')
	
	if not token:
		raise Unauthorized('Authorization token missing')
	
	course_id = request.json['course_id']

	return courses.all_students(course_id) 

if __name__ == '__main__':
	app.run(debug=True)