from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import auth
import courses.courses as courses
import courses.content as content
import courses.classes as classes
import validate as v

# init app
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'


# init db
from models import db, ma # DON'T MOVE THIS LINE
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
# AUTH
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

# COURSES: BASICS
@app.route('/dashboard/course-list', methods=['GET'])
def user_courses():
	token = get_token(request)
	user_id = v.validate_token(token)	
	return courses.user_courses(user_id)

@app.route('/courses/<int:course_id>/name', methods=['GET'])
def get_course_name(course_id):
	token = get_token(request)
	v.validate_token(token)

	return courses.id_to_name(course_id)

@app.route('/courses/create', methods=['POST'])
def create_course():
	token = get_token(request)
	
	user_id = v.validate_token(token)
	course_name = request.json['courseName']
	
	return courses.create(course_name, user_id)

@app.route('/courses/<int:course_id>/invite', methods=['POST'])
def add_user(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)
	student_email = request.json['email']

	return courses.invite(user_id, course_id, student_email) 

@app.route('/courses/<int:course_id>/students', methods=['GET'])
def all_students(course_id):
	token = get_token(request)
	v.validate_token(token)

	return courses.all_students(course_id) 

# COURSES: ONLINE CLASSES
@app.route('/courses/<int:course_id>/create-class', methods=['POST'])
def create_class(course_id):
	token = get_token(request)
	v.validate_token(token)
	class_name = request.json['className']

	return classes.create(course_id, class_name) 

@app.route('/courses/<int:course_id>/classes', methods=['GET'])
def course_classes(course_id):
	token = get_token(request)
	v.validate_token(token)
	
	return classes.getAll(course_id)

# COURSES: CONTENT
@app.route('/courses/<int:course_id>/create-folder', methods=['POST'])
def create_folder(course_id):
	token = get_token(request)	
	user_id = v.validate_token(token)
	
	folder_name = request.json['folderName']
	return content.create_folder(folder_name, user_id, course_id)

@app.route('/courses/<int:folder_id>/create-file', methods=['POST'])
def upload_file(folder_id):
	token = get_token(request)	
	user_id = v.validate_token(token)

	file = request.files['file']
	# file_name = secure_filename(file.fileName)
	file_name = request.form.get('fileName')
	data = file.read()

	return content.create_file(file_name, user_id, folder_id, data)

# App Route
@app.route('/courses/<int:course_id>/content', methods=['GET'])
def get_course_content(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return content.get_course_content(user_id, course_id)

# HELPERS
def get_token(request):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	else:
		return token

if __name__ == '__main__':
	app.run(debug=True)