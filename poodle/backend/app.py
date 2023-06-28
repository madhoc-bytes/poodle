from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import auth
import courses
import validate as v

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

'''
headers: Authorization: Bearer <token>
data:
{
  "email": "teacher1@example.com",
  "first_name": "John",
  "id": 3,
  "is_teacher": true,
  "last_name": "Doe"
},

return:
{
  "email": "teacher1@example.com",
  "first_name": "John",
  "id": 3,
  "is_teacher": true,
  "last_name": "Doe"
}, <status>
'''

# returns
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

@app.route('/dashboard/course-list', methods=['GET'])
def user_courses():
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	user_id = v.validate_token(token)	
	return courses.user_courses(user_id)

@app.route('/courses/create', methods=['POST'])
def create_course():
	token = request.headers.get('Authorization')

	if not token:
		raise Unauthorized('Authorization token missing')
	
	user_id = v.validate_token(token)
	course_name = request.json['course_name']
	
	return courses.create(course_name, user_id)

@app.route('/courses/<int:course_id>/invite', methods=['POST'])
def add_user(course_id):
	token = request.headers.get('Authorization')	
	if not token:
		raise Unauthorized('Authorization token missing')	
	user_id = v.validate_token(token)
	student_email = request.json['email']

	return courses.invite(user_id, course_id, student_email) 

@app.route('/courses/<int:course_id>/students', methods=['GET'])
def all_students(course_id):
	token = request.headers.get('Authorization') 	
	if not token:
		raise Unauthorized('Authorization token missing')
	v.validate_token(token)

	return courses.all_students(course_id) 

@app.route('/courses/<int:course_id>/create-class', methods=['POST'])
def create_class(course_id):
	token = request.headers.get('Authorization')	
	if not token:
		raise Unauthorized('Authorization token missing')
	v.validate_token(token)
	class_name = request.json['class_name']

	return courses.create_class(course_id, class_name) 

@app.route('/courses/<int:course_id>/classes', methods=['GET'])
def course_classes(course_id):
	token = request.headers.get('Authorization')	
	if not token:
		raise Unauthorized('Authorization token missing')
	v.validate_token(token)
	
	return courses.all_classes(course_id) 

if __name__ == '__main__':
    app.run(debug=True)