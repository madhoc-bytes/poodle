from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import auth
import quiz
import assignment
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
	file_name = file.filename

	return content.create_file(file_name, user_id, folder_id, file)

# fetch a file
@app.route('/courses/<int:file_id>', methods=['GET'])
def get_file(file_id):
	token = get_token(request)
	v.validate_token(token)

	return content.get_file(file_id)

@app.route('/course/<int:course_id>/content', methods=['GET'])
def get_course_content(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return content.get_course_content(user_id, course_id)

# search
@app.route('/course/<int:course_id>/content/search', methods=['GET'])
def search_content(course_id):
	token = get_token(request)
	v.validate_token(token)

	query = request.json['query']
	return content.search(course_id, query)


# HELPERS
def get_token(request):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	else:
		return token

@app.route('/courses/<int:course_id>/quiz_list', methods=['GET'])
def user_quizzes(course_id):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	user_id = v.validate_token(token)

	return quiz.user_quizzes_course(user_id, course_id)

@app.route('/courses/<int:course_id>/quiz/<int:quiz_id>/name', methods=['GET'])
def get_quiz_name(course_id, quiz_id):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	v.validate_token(token)

	return quiz.get_quiz_name(course_id, quiz_id)

@app.route('/courses/<int:course_id>/quiz/create', methods=['POST'])
def create_quiz(course_id):
	token = request.headers.get('Authorization')

	if not token:
		raise Unauthorized('Authorization token missing')
	
	user_id = v.validate_token(token)
	quiz_name = request.json['quizName']
	due_date = request.json['dueDate']

	return quiz.create_quiz(quiz_name, user_id, course_id, due_date)

@app.route('/courses/<int:course_id>/quiz/<int:quiz_id>/questions', methods=['GET'])
def quiz_questions(course_id, quiz_id):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	v.validate_token(token)

	return quiz.get_quiz_questions(course_id, quiz_id)

@app.route('/course/<int:course_id>/quiz/<int:quiz_id>/questions/create', methods=['POST'])
def create_question(course_id, quiz_id):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	v.validate_token(token)

	question = request.json['question']
	time_limit = request.json['timeLimit']
	points = request.json['points']
	is_multi = request.json['isMulti']

	return quiz.create_question(course_id, quiz_id, question, time_limit, points, is_multi)	

@app.route('/course/<int:course_id>/quiz/<int:quiz_id>/question/<int:question_id>/answers', methods=['GET'])
def get_quiz_question_answers(course_id, quiz_id, question_id):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	v.validate_token(token)

	return quiz.get_quiz_question_answers(course_id, quiz_id, question_id)

@app.route('/course/<int:course_id>/quiz/<int:quiz_id>/question/<int:question_id>/answers/create', methods=['POST'])
def create_answer(course_id, quiz_id, question_id):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	v.validate_token(token)

	answer = request.json['answer']
	is_correct = request.json['isCorrect']

	return quiz.create_answer(course_id, quiz_id, question_id, answer, is_correct)

@app.route('/course/<int:course_id>/assignment_list', methods=['GET'])
def get_assignments(course_id):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	user_id = v.validate_token(token)

	return assignment.get_assignments_course(user_id, course_id)

@app.route('/course/<int:course_id>/assignments/<int:ass_id>/name', methods=['GET'])
def get_ass_name(course_id, ass_id):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	v.validate_token(token)

	return assignment.get_ass_name(course_id, ass_id)

@app.route('/course/<int:course_id>/assignments', methods=['GET'])
def get_ass(course_id):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	v.validate_token(token)

	return assignment.all_ass(course_id)

@app.route('/course/<int:course_id>/assignments/create', methods=['POST'])
def create_assignment(course_id):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	user_id = v.validate_token(token)

	title = request.json['title']
	due_date = request.json['due_date']
	description = request.json['description']
	marks = request.json['marks']
	num_sub = request.json['num_sub']

	return assignment.create_assignment(user_id, course_id, title, due_date, description, marks, num_sub)



if __name__ == '__main__':
	app.run(debug=True)
