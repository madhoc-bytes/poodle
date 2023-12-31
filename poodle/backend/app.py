from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import auth
import courses.quiz as quiz
import avatar
import badges as badges
import courses.assignment as assignment
import courses.courses as courses
import courses.content as content
import courses.classes as classes
import courses.leaderboards as leaderboards
import courses.forums as forums
import profiles as profile
import timeline

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

# APP DECORATORS
############################################################################################################
# AUTH
@app.route('/register', methods=['POST'])

def register():
	'''
    Register a new user account.
    
    Body:
		JSON data containing the following fields:
        	{ "firstName", "lastName", "email", "password", "isTeacher" }
		
	Parameters:
		None

    Returns:
		User object, HTTP status code.
	    
	Raises:
		BadRequest: If the provided email already exists in the database.
		InternalServerError: If there was an issue while creating the user in the database.
	'''
	first_name, last_name = request.json['firstName'], request.json['lastName']
	email, password = request.json['email'], request.json['password'] 
	is_teacher = request.json['isTeacher']  
	return auth.register(email, password, first_name, last_name, is_teacher)

@app.route('/login', methods=['POST'])
def login():
	'''
	Login an existing user.

	Body:
		JSON data containing the following fields:
			{ "email", "password" }
	
	Parameters:
		None

	Returns:
		JSON Object: {'message', 'token', 'user_id', 'is_teacher},
		HTTP status code
	'''
	email, password = request.json['email'], request.json['password']
	return auth.login(email, password)

@app.route('/logout', methods=['POST'])
def logout():
	'''
	Logout an existing user.

	Body:
		None

	Parameters:
		None

	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = request.headers.get('Authorization')
	return auth.logout(token)

# COURSES
@app.route('/dashboard/course-list', methods=['GET'])
def user_courses():
	'''
	Fetch a list of courses a user is part of (for both teachers and students).

	Parameters:
		None
	
	Returns:
		JSON Object: {'courses': [{'course_id', 'course_name'}...]},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)	
	return courses.user_courses(user_id)

@app.route('/courses/<int:course_id>/name', methods=['GET'])
def get_course_name(course_id):
	'''
	Fetch the name of a course given a course_id.

	Parameters:
		course_id (int)
			
	Returns:
		JSON Object: {'courseName'},
		HTTP status code

	'''
	token = get_token(request)
	v.validate_token(token)

	return courses.id_to_name(course_id)

    
@app.route('/courses/create', methods=['POST'])
def create_course():
	'''
	Create a new course.

	Parameters:
		None
	
	Returns:
		JSON Object: {'message', 'course_id'},
		HTTP status code
	
	'''
	token = get_token(request)
	
	user_id = v.validate_token(token)
	course_name = request.json['courseName']
	
	return courses.create(course_name, user_id)

   
@app.route('/courses/<int:course_id>/invite', methods=['POST'])
def add_user(course_id):
	'''
	Invite a student to a course. 

	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)
	student_email = request.json['email']

	return courses.invite(user_id, course_id, student_email) 

@app.route('/courses/<int:course_id>/students', methods=['GET'])
def all_students(course_id):
	'''
	Fetch the details of all students that belong to a particular course. 

	Body:
		None

	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'students': [{'id', 'first_name', 'last_name', 'email'}...]},
		HTTP status code
	'''
	token = get_token(request)
	v.validate_token(token)

	return courses.all_students(course_id) 

@app.route('/courses/<int:course_id>/create-class', methods=['POST'])
def create_class(course_id):
	'''
	Create an online class within a course.

	Body:
		JSON data containing the following fields:
			{ "className" }
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'message', 'class_id'},
		HTTP status code
	'''
	token = get_token(request)
	v.validate_token(token)
	class_name = request.json['className']

	return classes.create(course_id, class_name) 

@app.route('/courses/<int:course_id>/classes', methods=['GET'])
def course_classes(course_id):
	'''
	Fetch the details of all classes that belong to a particular course.

	Body:
		None
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'classes': [{'id', 'name'}...]},
		HTTP status code
	'''
	token = get_token(request)
	v.validate_token(token)
	
	return classes.getAll(course_id)

# COURSES: CONTENT
@app.route('/courses/<int:course_id>/create-folder', methods=['POST'])
def create_folder(course_id):
	'''
	Create a folder within a course.

	Body:
		JSON data containing the following fields:
			{ "folderName" }
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'message', 'folder_id'},
		HTTP status code
	'''
	token = get_token(request)	
	user_id = v.validate_token(token)
	
	folder_name = request.json['folderName']
	return content.create_folder(folder_name, user_id, course_id)

@app.route('/courses/<int:folder_id>/create-file', methods=['POST'])
def upload_file(folder_id):
	'''
	Upload a file to a folder within a course.

	Body:
		JSON data containing the following fields:
	
	Parameters:
		folder_id (int): A int containing the id of the folder in interest.
	
	Returns:
		JSON Object: {'message', 'file_id'},
		HTTP status code
	'''
	token = get_token(request)	
	user_id = v.validate_token(token)

	file = request.files['file']
	file_name = file.filename

	return content.create_file(file_name, user_id, folder_id, file)

# fetch a file
@app.route('/courses/download-file/<int:file_id>', methods=['GET'])
def get_file(file_id):
	'''
	get a file from a folder within a course.

	Body:
		None
	
	Parameters:
		file_id (int): A int containing the id of the file in interest.
	
	Returns:
		JSON Object: {'message', 'file_id'},
		HTTP status code
	'''
	token = get_token(request)
	v.validate_token(token)

	return content.get_file(file_id)

@app.route('/course/<int:course_id>/content', methods=['GET'])
def get_course_content(course_id):
	'''
	Get the content of a course.

	Body:
		None
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'message', 'file_id'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return content.get_course_content(user_id, course_id)

@app.route('/course/<int:course_id>/content/search/<string:query>', methods=['GET'])
def search_content(course_id, query):
	'''
	Search a query for the content of a course.

	Body:
		None
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'message', 'file_id'},
		HTTP status code
	'''
	token = get_token(request)
	v.validate_token(token)

	return content.search(course_id, query)



# ASSIGNMENTS
@app.route('/courses/<int:course_id>/assignments/create', methods=['POST'])
def create_assignment(course_id):
	'''
	Create an assignment within a course.

	Body:
		JSON data containing the following fields:
			{ "title", "description", "dueDate", "maxMarks" }
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'message', 'assignment_id'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	title = request.json['title']
	description = request.json['description']
	due_date = request.json['dueDate']
	max_marks = request.json['maxMarks']

	return assignment.create(user_id, course_id, title, description, due_date, max_marks)


@app.route('/courses/assignments/<int:assignment_id>/edit', methods=['PUT'])
def edit_assignment(assignment_id):
	'''
	Eidt an assignment within a course.

	Body:
		JSON data containing the following fields:
			{ "title", "description" }
	
	Parameters:
		assignment_id (int): A int containing the id of the assignment in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	title = request.json['title']
	description = request.json['description']

	return assignment.edit(user_id, assignment_id, title, description)

@app.route('/courses/assignments/<int:assignment_id>/specification', methods=['PUT'])
def upload_spec(assignment_id):
	'''
	Uplaod a specification file for an assignment.

	Body:
		JSON data containing the following fields:
			{ "file" }
	
	Parameters:
		assignment_id (int): A int containing the id of the assignment in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	spec_file = request.files['file']
	return assignment.upload_spec(user_id, assignment_id, spec_file)

@app.route('/courses/<int:course_id>/assignments', methods=['GET'])
def get_assignments(course_id):
	'''
	Get all assignments within a course.

	Body:
		None

	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'assignments': [{'id', 'title', 'description', 'due_date', 'max_marks'}...]},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return assignment.get_assignments(user_id, course_id)

@app.route('/courses/assignments/<int:assignment_id>/submit', methods=['PUT'])
def submit_assignment(assignment_id):
	'''
	Submit an assignment.

	Body:
		JSON data containing the following fields:

	Parameters:
		assignment_id (int): A int containing the id of the assignment in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	submission_file = request.files['file']
	return assignment.submit(user_id, assignment_id, submission_file)

@app.route('/courses/assignments/<int:assignment_id>/submissions', methods=['GET'])
def fetch_submissions(assignment_id):
	'''
	Fetch all submissions for an assignment.

	Body:
		None
	
	Parameters:
		assignment_id (int): A int containing the id of the assignment in interest.
	
	Returns:
		JSON Object: {'submissions': [{'id', 'student_id', 'student_email', 'submission_time', 'score'}...]},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return assignment.all_submissions(user_id, assignment_id)

@app.route('/courses/assignments/mark/<int:submission_id>', methods=['PUT'])
def update_score(submission_id):
	'''
	Update the score of a submission.

	Body:
		JSON data containing the following fields:
			{ "score" }
	
	Parameters:
		submission_id (int): A int containing the id of the submission in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	score = request.json['score']

	return assignment.update_score(user_id, submission_id, score)

@app.route('/courses/assignments/score/<int:submission_id>', methods=['GET']) 
def fetch_score(submission_id):
	'''
	Fetch the score of a submission.

	Body:
		None
	
	Parameters:
		submission_id (int): A int containing the id of the submission in interest.

	Returns:
		JSON Object: {'score'},
		HTTP status code
	''' 
	token = get_token(request)
	user_id = v.validate_token(token)

	return assignment.fetch_score(user_id, submission_id)

# QUIZZES
@app.route('/courses/<int:course_id>/quiz/create', methods=['POST'])
def create_quiz(course_id):
	'''
	Create a quiz within a course.

	Body:
		JSON data containing the following fields:
			{ "quizName", "dueDate", "timeLimit" }
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'message', 'quiz_id'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	quiz_name = request.json['quizName']
	due_date = request.json['dueDate']
	time_limit = request.json['timeLimit']

	return quiz.create_quiz(user_id, course_id, quiz_name, due_date, time_limit)

@app.route('/quiz/<int:quiz_id>/edit', methods=['PUT'])
def update_quiz(quiz_id):
	'''
	Update a quiz's details

	Body:
		JSON data containing the following fields:
			{ "quizName", "quizDueDate", "quizTimeLimit", "newQuestions" }
	
	Parameters:
		quiz_id (int): A int containing the id of the quiz in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	quiz_name = request.json['quizName']
	due_date = request.json['quizDueDate']
	time_limit = request.json['quizTimeLimit']
	questions = request.json['newQuestions']
	
	return quiz.update_quiz(user_id, quiz_id, quiz_name, due_date, time_limit, questions)

@app.route('/quiz/<int:quiz_id>/create-question', methods=['PUT'])
def create_question(quiz_id):
	'''
	Create a question in the quiz

	Body:
		JSON data containing the following fields:
			{ "questionName", "isMulti", "answers", "correctAnswer" }
	
	Parameters:
		quiz_id (int): A int containing the id of the quiz in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	question_name = request.json['questionName']
	is_multi = request.json['isMulti']
	answers = request.json['answers']
	correct_answer = request.json['correctAnswer']

	return quiz.create_question(user_id, quiz_id, question_name, is_multi, answers, correct_answer)


@app.route('/quiz/<int:quiz_id>/delete', methods=['DELETE'])
def delete_quiz(quiz_id):
	'''
	Delete a quiz

	Body:
		JSON data containing the following fields:
			{ "questionName", "isMulti", "answers", "correctAnswer" }
	
	Parameters:
		quiz_id (int): A int containing the id of the quiz in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.delete_quiz(user_id, quiz_id)

@app.route('/courses/<int:course_id>/quiz/names', methods=['GET'])
def get_quiz_names_teacher(course_id):
	'''
	Get a list of names of quizzes in a course

	Body:
		None
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		List of JSON Objects: [
			{'id', 'name', 'deployed'},...
		],
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.get_quiz_names_teacher(user_id, course_id)


@app.route('/quiz/<int:quiz_id>/info', methods=['GET'])
def get_quiz_info(quiz_id):
	'''
	Get the information of quiz

	Body:
		None
	
	Parameters:
		quiz_id (int): A int containing the id of the quiz in interest.
	
	Returns:
		JSON Object: {'message', 'quiz'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.get_quiz_info(user_id, quiz_id)

@app.route('/quiz/<int:quiz_id>/deploy', methods=['PUT'])
def deploy_quiz(quiz_id):
	'''
	Deploy a quiz to students

	Body:
		None
	
	Parameters:
		quiz_id (int): A int containing the id of the quiz in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.deploy_quiz(user_id, quiz_id)

# STUDENT QUIZ
@app.route('/quiz/<int:quiz_id>/student-attempt', methods=['POST'])
def attempt_quiz(quiz_id):
	'''
	Attempt a quiz (for student)

	Body:
		None
	
	Parameters:
		quiz_id (int): A int containing the id of the quiz in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.create_quiz_score(user_id, quiz_id)

@app.route('/courses/<int:course_id>/quiz/student-details', methods=['GET'])
def get_quizzes_student(course_id):
	'''
	Get quiz information 

	Body:
		None
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		List of JSON Objects: [
			{'name', 'score', 'dueDate', 'status', 'maxMarks', 'timeLimit'},...
		],
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.get_quiz_score(user_id, course_id)

@app.route('/quiz/<int:quiz_id>/studentinfo', methods=['GET'])
def get_quiz_info_student(quiz_id):
	'''
	Get quiz information for student

	Body:
		None
	
	Parameters:
		quiz_id (int): A int containing the id of the quiz in interest.
	
	Returns:
		JSON Object: {'message', 'quizInfo'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.get_quiz_info_student(user_id, quiz_id)

@app.route('/quiz/<int:quiz_id>/update-score', methods=['PUT'])
def update_quiz_score(quiz_id):
	'''
	Update a student's score in a quiz attempt

	Body:
		JSON data containing the following fields:
			{ "score" }
	
	Parameters:
		quiz_id (int): A int containing the id of the quiz in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	score = request.json['score']

	return quiz.update_quiz_score(user_id, quiz_id, score)

@app.route('/quiz/<int:quiz_id>/submit', methods=['PUT'])
def submit_quiz(quiz_id):
	'''
	Submit a student's attempt

	Body:
		None
	
	Parameters:
		quiz_id (int): A int containing the id of the quiz in interest.
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return quiz.submit_quiz(user_id, quiz_id)

# LEADERBOARD
@app.route('/courses/<int:course_id>/leaderboards', methods=['GET'])
def get_leaderboards(course_id):
	'''
	Get the leaderboards for a course.

	Body:
		None

	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'leaderboards': [{'name', 'median', 'mean', 'curr_student', 'top_ten' : []}...]},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return leaderboards.retrieve(user_id, course_id)

# TIMELINE
@app.route('/dashboard/timeline', methods=['GET'])
def dashboard_timeline():
	'''
	dashboard timeline

	Body:
		None
	
	Parameters:
		None

	Returns:
		JSON Object: {'timeline': [{'id', 'type', 'title', 'description', 'date', 'course_id', 'class_id', 'quiz_id', 'assignment_id', 'forum_post_id', 'forum_reply_id'}...]},
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return timeline.retrieve(user_id)

# FORUMS
@app.route('/courses/<int:course_id>/forums/post-forum', methods=['POST'])
def create_forum_post(course_id):
	'''
	Create a post in the forum

	Body:
		JSON data containing the following fields:
			{ "title", "category", "description" }
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
	
	Returns:
		JSON Object: {'message', 'post_id'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	title = request.json['title']
	category = request.json['category']
	description = request.json['description']

	return forums.create(user_id, course_id, title, category, description)

@app.route('/courses/forums/post/<int:post_id>/attach-file', methods=['PUT'])
def upload_forum_multimedia(post_id):
	'''
	Upload content into the forum

	Body:
		JSON data containing the following fields:
			{ "file" }
	
	Parameters:
		post_id (int): A int containing the id of the post in interest.
	
	Returns:
		JSON Object: {'message', 'file'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	attachment = request.files['file']
	return forums.upload_multimedia(user_id, post_id, attachment)


@app.route('/courses/forums/<int:forum_post_id>/post-answer', methods=['POST'])
def reply_forum_post(forum_post_id):
	'''
	Reply to a post in the forum

	Body:
		JSON data containing the following fields:
			{ "answer"}
	
	Parameters:
		forum_post_id (int): A int containing the id of the forum_post in interest.
	
	Returns:
		JSON Object: {'message', 'forum_reply_id'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	answer = request.json['answer']

	return forums.reply(user_id, forum_post_id, answer)



@app.route('/courses/<int:course_id>/forums/category/<string:category>/search/', methods=['GET'])
@app.route('/courses/<int:course_id>/forums/category/<string:category>/search/<string:phrase>', methods=['GET'])
def get_forum_posts(course_id, category, phrase=None):
	'''
	Get forum posts for a course

	Body:
		None
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
		category (string): A string of the category of the forum post.
		phrase (string): A string of the phrase to search for.
	
	Returns:
		List of JSON Object: [
			{'title', 'post_id', 'category', 'first_name', 'last_name', 
			'date_posted', 'num_replies'},...
		],
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return forums.get_posts(user_id, course_id, category, phrase)


@app.route('/courses/<int:course_id>/forums/post/<int:post_id>', methods=['GET'])
def get_forum_post_replies(course_id, post_id):
	'''
	Get replies to a forum post

	Body:
		None
	
	Parameters:
		course_id (int): A int containing the id of the course in interest.
		post_id (int): A int containing the id of the post in interest.
	
	Returns:
		JSON Object: {'post_id', 'title', 'category', 'author_id', 'first_name',
		'last_name', 'file_id', 'date_posted', 'description', 'replies'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return forums.get_post_replies(user_id, course_id, post_id)

# Profile
@app.route('/profile/edit', methods=['PUT'])
def edit_profile():
	'''
	Edit a user's profile

	Body:
		JSON data containing the following fields:
			{ "firstName", "lastName", "password"}
	
	Parameters:
		None
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	first_name = request.json['firstName']
	last_name = request.json['lastName']
	password = request.json['password']

	return profile.edit(user_id, first_name, last_name, password)

@app.route('/profile/stars', methods=['GET'])
def get_stars():
	'''
	Get a user's stars

	Body:
		None
	
	Parameters:
		None
	
	Returns:
		JSON Object: {'stars'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return profile.get_stars(user_id)

@app.route('/profile/stars/add', methods=['PUT'])
def add_stars():
	'''
	Add stars to the user's profile

	Body:
		JSON data containing the following fields:
			{ "stars" }
	
	Parameters:
		None
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	stars = request.json['stars']

	return profile.add_star(user_id, stars)

@app.route('/profile/info', methods=['GET'])
def get_my_info():
	'''
	Get a user's information

	Body:
		None
	
	Parameters:
		None
	
	Returns:
		JSON Object of User Schema,
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return profile.get_info(user_id)

@app.route('/profile/info/<int:user_id>', methods=['GET'])
def get_user_info(user_id):
	'''
	Get another user's information

	Body:
		None
	
	Parameters:
		user_id (int): A int containing the id of the user in interest.
	
	Returns:
		JSON Object of User Schema,
		HTTP status code
	'''
	token = get_token(request)
	v.validate_token(token)

	return profile.get_info(user_id)

# AVATAR
@app.route('/profile/avatar/preview', methods=['GET'])
def get_avatar_preview():
	'''
	Get current attributes of an avatar

	Body:
		None
	
	Parameters:
		None
	
	Returns:
		JSON Object: {'curr_atts'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return avatar.get_avatar_preview(user_id)
     
@app.route('/profile/avatar/preview/<int:user_id>', methods=['GET'])
def get_target_avatar(user_id):
	'''
	Get current attributes of another avatar

	Body:
		None
	
	Parameters:
		user_id (int): A int containing the id of the user in interest.
	
	Returns:
		JSON Object: {'curr_atts'},
		HTTP status code
	'''
	token = get_token(request)
	v.validate_token(token)

	return avatar.get_avatar_preview(user_id)

@app.route('/profile/avatar/unlock', methods=['PUT'])
def unlock_attribute():
	'''
	Unlock an attribute

	Body:
		JSON data containing the following fields:
			{ "attribute", "style" }
	
	Parameters:
		None
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	attribute = request.json['attribute']
	style = request.json['style']

	return avatar.unlock_attribute(user_id, attribute, style)

@app.route('/profile/avatar/update', methods=['PUT'])
def update_avatar():
	'''
	Update a user's avatar

	Body:
		JSON data containing the following fields:
			{ "attributes" }
	
	Parameters:
		None
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	attributes = request.json['attributes']

	return avatar.update_avatar(user_id, attributes)

@app.route('/profile/avatar/attributes', methods=['GET'])
def get_attributes():
	'''
	Get all unlocked attributes of an avatar

	Body:
		None
	
	Parameters:
		None
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return avatar.get_attributes(user_id)

# BADGES
@app.route('/profile/badges/tallies', methods=['GET'])
def get_tallies():
	'''
	Get badge tallies of a user

	Body:
		None
	
	Parameters:
		None
	
	Returns:
		JSON Object: {'message', 'tallies'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	return badges.get_tallies(user_id)

@app.route('/profile/badges/tallies/<int:user_id>', methods=['GET'])
def get_user_tallies(user_id):
	'''
	Get badge tallies of a user

	Body:
		None
	
	Parameters:
		user_id (int): A int containing the id of the user in interest.
	
	Returns:
		JSON Object: {'message', 'tallies'},
		HTTP status code
	'''
	token = get_token(request)
	v.validate_token(token)

	return badges.get_tallies(user_id)


@app.route('/profile/badges/update', methods=['PUT'])
def update_badges():
	'''
	Update badge tallies of a user

	Body:
		JSON data containing the following fields:
			{ "efficient", "academic", "helpful" }
	
	Parameters:
		None
	
	Returns:
		JSON Object: {'message'},
		HTTP status code
	'''
	token = get_token(request)
	user_id = v.validate_token(token)

	efficient = request.json['efficient']
	academic = request.json['academic']
	helpful = request.json['helpful']

	return badges.update_tallies(user_id, efficient, academic, helpful)

# HELPERS
def get_token(request):
	token = request.headers.get('Authorization')
	if not token:
		raise Unauthorized('Authorization token missing')
	else:
		return token

if __name__ == '__main__':
	app.run(host="0.0.0.0", port=5000, debug=True)