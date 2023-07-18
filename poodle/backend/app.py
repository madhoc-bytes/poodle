from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import auth
import quiz
import courses.assignment as assignment
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
@app.route('/courses/download-file/<int:file_id>', methods=['GET'])
def get_file(file_id):
	token = get_token(request)
	v.validate_token(token)

	return content.get_file(file_id)

@app.route('/course/<int:course_id>/content', methods=['GET'])
def get_course_content(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return content.get_course_content(user_id, course_id)

@app.route('/course/<int:course_id>/content/search/<query>', methods=['GET'])
def search_content(course_id, query):
	token = get_token(request)
	v.validate_token(token)

	return content.search(course_id, query)

# Assignments
@app.route('/courses/<int:course_id>/assignments/create', methods=['POST'])
def create_assignment(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	title = request.json['title']
	description = request.json['description']
	due_date = request.json['dueDate']
	max_marks = request.json['maxMarks']

	return assignment.create(user_id, course_id, title, description, due_date, max_marks)

@app.route('/courses/assignments/<int:assignment_id>/edit', methods=['PUT'])
def edit_assignment(assignment_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	title = request.json['title']
	description = request.json['description']

	return assignment.edit(user_id, assignment_id, title, description)

@app.route('/courses/assignments/<int:assignment_id>/specification', methods=['PUT'])
def upload_spec(assignment_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	spec_file = request.files['file']
	return assignment.upload_spec(user_id, assignment_id, spec_file)

@app.route('/courses/<int:course_id>/assignments', methods=['GET'])
def get_assignments(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return assignment.get_assignments(user_id, course_id)

@app.route('/courses/assignments/<int:assignment_id>/submit', methods=['PUT'])
def submit_assignment(assignment_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	submission_file = request.json['file']
	return assignment.submit(user_id, assignment_id, submission_file)

@app.route('/courses/assignments/<int:assignment_id>/submissions', methods=['GET'])
def fetch_submissions(assignment_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return assignment.all_submissions(user_id, assignment_id)


@app.route('/courses/assignments/mark/<int:submission_id>', methods=['PUT'])
def update_score(submission_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	score = request.json['score']

	return assignment.update_score(user_id, submission_id, score)

@app.route('/courses/assignments/score/<int:submission_id>', methods=['GET']) 
def fetch_score(submission_id): #TODO: probs wont need this route
	token = get_token(request)
	user_id = v.validate_token(token)

	return assignment.fetch_score(user_id, submission_id)

# HELPERS
def get_token(request):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	else:
		return token

# QUIZ
@app.route('/courses/<int:course_id>/quiz/create', methods=['POST'])
def create_quiz(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	quiz_name = request.json['quizName']
	due_date = request.json['dueDate']
	time_limit = request.json['timeLimit']

	return quiz.create_quiz(user_id, course_id, quiz_name, due_date, time_limit)

@app.route('/quiz/<int:quiz_id>/edit', methods=['PUT'])
def update_quiz(quiz_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	quiz_name = request.json['quizName']
	due_date = request.json['quizDueDate']
	time_limit = request.json['quizTimeLimit']
	questions = request.json['newQuestions']
	
	return quiz.update_quiz(user_id, quiz_id, quiz_name, due_date, time_limit, questions)

@app.route('/quiz/<int:quiz_id>/create-question', methods=['PUT'])
def create_question(quiz_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	question_name = request.json['questionName']
	is_multi = request.json['isMulti']
	answers = request.json['answers']
	correct_answer = request.json['correctAnswer']

	return quiz.create_question(user_id, quiz_id, question_name, is_multi, answers, correct_answer)


@app.route('/quiz/<int:quiz_id>/delete', methods=['DELETE'])
def delete_quiz(quiz_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.delete_quiz(user_id, quiz_id)

@app.route('/courses/<int:course_id>/quiz/names', methods=['GET'])
def get_quiz_names_teacher(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.get_quiz_names_teacher(user_id, course_id)


@app.route('/quiz/<int:quiz_id>/info', methods=['GET'])
def get_quiz_info(quiz_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.get_quiz_info(user_id, quiz_id)

@app.route('/quiz/<int:quiz_id>/deploy', methods=['PUT'])
def deploy_quiz(quiz_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.deploy_quiz(user_id, quiz_id)

# STUDENT QUIZ
@app.route('/quiz/<int:quiz_id>/student-attempt', methods=['POST'])
def attempt_quiz(quiz_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.create_quiz_score(user_id, quiz_id)

@app.route('/courses/<int:course_id>/quiz/student-details', methods=['GET'])
def get_quizzes_student(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.get_quiz_score(user_id, course_id)

@app.route('/quiz/<int:quiz_id>/studentinfo', methods=['GET'])
def get_quiz_info_student(quiz_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.get_quiz_info_student(user_id, quiz_id)

@app.route('/quiz/<int:quiz_id>/update-score', methods=['PUT'])
def update_quiz_score(quiz_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	score = request.json['score']

	return quiz.update_quiz_score(user_id, quiz_id, score)

@app.route('/quiz/<int:quiz_id>/submit', methods=['PUT'])
def submit_quiz(quiz_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	score = request.json['score']

	return quiz.submit_quiz(user_id, quiz_id, score)

if __name__ == '__main__':
	app.run(debug=True)
