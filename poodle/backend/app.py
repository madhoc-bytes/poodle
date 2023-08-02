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



# COURSES
'''
Fetch a list of courses a user is part of (for both teachers and students).

Args: None.

Returns: 
	flask.Response: A JSON response that contains the name and id of courses the active user belongs to.

Raises: 
- Unauthorized: If the provided token is invalid or expired
- InternalServerError: If there was an issue while retrieving the user's courses.

Example Request: 
GET /dashboard/course-list
	Content-Type: application/json
	Authorization: Bearer <valid_token>

Example Return:
[{'name:' 'COMP3900', 'id': 1}, {'name': 'COMP9444', 'id': 2}]
'''

@app.route('/dashboard/course-list', methods=['GET'])
def user_courses():
	token = get_token(request)
	user_id = v.validate_token(token)	
	return courses.user_courses(user_id)


'''
Fetch the name of a course given a course_id.

Args: 
	course_id (int): the id of a particular course.

Returns: 
	str: The name of the course with the provided course_id.

Raises: 
- Unauthorized: If the provided token is invalid or expired
- InternalServerError: If there was an issue while retrieving the user's courses.

Example Request: 
GET /courses/1/name
	Content-Type: application/json
	Authorization: Bearer <valid_token>

Example Return:
'COMP3900'

'''

@app.route('/courses/<int:course_id>/name', methods=['GET'])
def get_course_name(course_id):
	token = get_token(request)
	v.validate_token(token)

	return courses.id_to_name(course_id)


'''
Create a new course for the authenticated user. 

Args:
	courseName (str): A string containing the desired name for the course to be created.

Returns:
	flask.Response: A JSON response that includes a message indicating the result of the course creation process,
	and the id of the cnewly created course.

Raises:
	Unauthorized: If the provided token is invalid, expired, or if the user is not a teacher.
	BadRequest: If the 'courseName' field is missing or empty in the JSON data.
	InternalServerError: If there was an issue while creating the course in the database.

Example Request:
	POST /courses/create
	Content-Type: application/json
	Authorization: Bearer <valid_token>
	{
		"courseName": "Introduction to Python"
	}

Example Response:
	{
		'message': 'Course created successfully', 
		'course_id': 3
	}
'''
    
@app.route('/courses/create', methods=['POST'])
def create_course():
	token = get_token(request)
	
	user_id = v.validate_token(token)
	course_name = request.json['courseName']
	
	return courses.create(course_name, user_id)


'''
Invite a student to a course. 

Args:
	email (str): A string containing the email of the student to be added.

Returns:
	flask.Response: A JSON response that includes a message indicating the result of the invitation process.

Raises:
	Unauthorized: If the provided token is invalid, expired, or if the user is not a teacher.
	NotFound: If there does not exist a student with the provided email address.
	BadRequest: If the provided email belongs to a teacher, or if the student is already part of the course.
	InternalServerError: If there was an issue while creating the course in the database.

Example Request:
	POST /courses/1/invite
	Content-Type: application/json
	Authorization: Bearer <valid_token>
	{
		"email": "mechypoodle@gmail.com"
	}

Example Response (200, OK):
	{
	'message': 'User enrolled in the course successfully'
	}
'''
   
@app.route('/courses/<int:course_id>/invite', methods=['POST'])
def add_user(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)
	student_email = request.json['email']

	return courses.invite(user_id, course_id, student_email) 


'''
Fetch the details of all students that belong to a particular course. 

Args:
	course_id (int): A int containing the id of the course in interest.

Returns:
	flask.Response: A JSON response that contains details of all students that belong to the course.

Raises:
	Unauthorized: If the provided token is invalid, expired.
	NotFound: If there does not exist a course with the provided course_id.
	InternalServerError: If there was an issue while creating the course in the database.

Example Request:
	GET /courses/1/students
	Content-Type: application/json
	Authorization: Bearer <valid_token>

Example Response (200, OK):
	[{'first_name': 'John', 'last_name': 'Smith', 'email': 'john.smith@example.com'},
	{'first_name': 'Jane', 'last_name': 'Smith', 'email': 'jane.smith@example.com'}]
'''

@app.route('/courses/<int:course_id>/students', methods=['GET'])
def all_students(course_id):
	token = get_token(request)
	v.validate_token(token)

	return courses.all_students(course_id) 


'''
Create an online class within a course. 

Args:
	course_id (int): A int containing the id of the course in interest.
	className (str): A string containing the name of the new online class.

Returns:
	flask.Response: A JSON response that includes a message indicating the result of the class creation process, 
	and the id of the class.

Raises:
	Unauthorized: If the provided token is invalid, expired.
	NotFound: If there does not exist a course with the provided course_id.
	InternalServerError: If there was an issue while creating the course in the database.

Example Request:
	POST /courses/1/create-class
	Content-Type: application/json
	Authorization: Bearer <valid_token>
	className = 'Room 1'

Example Response (200, OK):
	{
		'message': 'Class successfully created', 
		'class_id': 1
	}
'''

@app.route('/courses/<int:course_id>/create-class', methods=['POST'])
def create_class(course_id):
	token = get_token(request)
	v.validate_token(token)
	class_name = request.json['className']

	return classes.create(course_id, class_name) 


'''
Fetch all online classes within a course. 

Args:
	course_id (int): A int containing the id of the course in interest.

Returns:
	flask.Response: A JSON response containing relevant information about all online classes belonging to a course.

Raises:
	Unauthorized: If the provided token is invalid, expired.
	InternalServerError: If there was an issue while creating the course in the database.

Example Request:
	GET /courses/1/classes
	Content-Type: application/json
	Authorization: Bearer <valid_token>

Example Response (200, OK):
	[{'id': 1, 'name': Andy's study hub, 'course_id': 1}, {'id': 2, 'name': Eddy's study space, 'course_id': 1}]
'''

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

@app.route('/course/<int:course_id>/content/search/<string:query>', methods=['GET'])
def search_content(course_id, query):
	token = get_token(request)
	v.validate_token(token)

	return content.search(course_id, query)



# ASSIGNMENTS
'''
Create an assignment within a course. 

Args:
	course_id (int): A int containing the id of the course in interest.
	title (str): The title of the assignment to be created.
	description (str): A description of the assignment.
	dueDate (date): The date and time the assignment is due.
	maxMarks (int): The maximum number of marks that can be achieved for the assignment.

Returns:
	flask.Response: A JSON reponse that includes a message indicating the result of the assignment creation process, 
	and the id of the assignment.

Raises:
	Unauthorized: If the provided token is invalid, expired, or if the user is not a teacher.
	BadRequest: If the 'title', 'description', 'dueDate', 'maxMarks' fields are missing or empty in the JSON data, or 
	if the 'course_id' is not provided.
	InternalServerError: If there was an issue while creating the course in the database.

Example Request:
	POST /courses/1/assignments/create
	Content-Type: application/json
	Authorization: Bearer <valid_token>
	title (str): 'Deom A'
	description (str): 'Demonstrate you're project'
	dueDate (date): '01-01-2024'
	maxMarks (int): 100


Example Response (201, OK):
	{
		'message': 'Assignment created successfully', 
		'assignment_id': 1
	}
	
'''

@app.route('/courses/<int:course_id>/assignments/create', methods=['POST'])
def create_assignment(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	title = request.json['title']
	description = request.json['description']
	due_date = request.json['dueDate']
	max_marks = request.json['maxMarks']

	return assignment.create(user_id, course_id, title, description, due_date, max_marks)


'''
Edit the title of description of an assignment within a course. 

Args:
	course_id (int): A int containing the id of the course in interest.
	title (str): The title of the assignment to be created.
	description (str): A description of the assignment.

Returns:
	flask.Response: A JSON reponse that includes a message indicating the result of the assignment editing process, 
	and the id of the assignment.

Raises:
	Unauthorized: If the provided token is invalid, expired, or if the user is not a teacher.
	BadRequest: If the 'title' or 'description' fields are missing or empty in the JSON data.
	InternalServerError: If there was an issue while creating the course in the database.

Example Request:
	POST /courses/1/assignments/create
	Content-Type: application/json
	Authorization: Bearer <valid_token>
	title (str): 'Demo A'
	description (str): 'Demonstrate your project'

Example Response (201, OK):
	{
		'message': 'Assignment edited successfully', 
		'assignment_id': 1
	}
	
'''

@app.route('/courses/assignments/<int:assignment_id>/edit', methods=['PUT'])
def edit_assignment(assignment_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	title = request.json['title']
	description = request.json['description']

	return assignment.edit(user_id, assignment_id, title, description)


'''
Upload the specification for an assignment. 

Args:
	assignment_id (int): A int containing the id of the assignment in interest.
	file (str): The title of the assignment to be created.

Returns:
	flask.Response: A JSON reponse that includes a message indicating the result of the assignment editing process, 
	and the id of the assignment.

Raises:
	Unauthorized: If the provided token is invalid, expired, or if the user is not a teacher.
	BadRequest: If the 'title' or 'description' fields are missing or empty in the JSON data.
	InternalServerError: If there was an issue while creating the course in the database.

Example Request:
	POST /courses/1/assignments/create
	Content-Type: application/json
	Authorization: Bearer <valid_token>
	title (str): 'Demo A'
	description (str): 'Demonstrate your project'

Example Response (201, OK):
	{
		'message': 'Assignment edited successfully', 
		'assignment_id': 1
	}
	
'''
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

	submission_file = request.files['file']
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
def fetch_score(submission_id): 
	token = get_token(request)
	user_id = v.validate_token(token)

	return assignment.fetch_score(user_id, submission_id)

# QUIZZES
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

	return quiz.submit_quiz(user_id, quiz_id)

# LEADERBOARD
@app.route('/courses/<int:course_id>/leaderboards', methods=['GET'])
def get_leaderboards(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return leaderboards.retrieve(user_id, course_id)

# TIMELINE
@app.route('/dashboard/timeline', methods=['GET'])
def dashboard_timeline():
	token = get_token(request)
	user_id = v.validate_token(token)

	return timeline.retrieve(user_id)

# FORUMS
@app.route('/courses/<int:course_id>/forums/post-forum', methods=['POST'])
def create_forum_post(course_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	title = request.json['title']
	category = request.json['category']
	description = request.json['description']

	return forums.create(user_id, course_id, title, category, description)

@app.route('/courses/forums/post/<int:post_id>/attach-file', methods=['PUT'])
def upload_forum_multimedia(post_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	attachment = request.files['file']
	return forums.upload_multimedia(user_id, post_id, attachment)


@app.route('/courses/forums/<int:forum_post_id>/post-answer', methods=['POST'])
def reply_forum_post(forum_post_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	answer = request.json['answer']

	return forums.reply(user_id, forum_post_id, answer)



@app.route('/courses/<int:course_id>/forums/category/<string:category>/search/', methods=['GET'])
@app.route('/courses/<int:course_id>/forums/category/<string:category>/search/<string:phrase>', methods=['GET'])
def get_forum_posts(course_id, category, phrase=None):
	token = get_token(request)
	user_id = v.validate_token(token)

	print('phrase: ', phrase)
	print('category: ', category)

	return forums.get_posts(user_id, course_id, category, phrase)


@app.route('/courses/<int:course_id>/forums/post/<int:post_id>', methods=['GET'])
def get_forum_post_replies(course_id, post_id):
	token = get_token(request)
	user_id = v.validate_token(token)

	return forums.get_post_replies(user_id, course_id, post_id)

# Profile
@app.route('/profile/edit', methods=['PUT'])
def edit_profile():
	token = get_token(request)
	user_id = v.validate_token(token)

	first_name = request.json['firstName']
	last_name = request.json['lastName']
	password = request.json['password']

	return profile.edit(user_id, first_name, last_name, password)

@app.route('/profile/stars', methods=['GET'])
def get_stars():
	token = get_token(request)
	user_id = v.validate_token(token)

	return profile.get_stars(user_id)

@app.route('/profile/stars/add', methods=['PUT'])
def add_stars():
	token = get_token(request)
	user_id = v.validate_token(token)

	stars = request.json['stars']

	return profile.add_star(user_id, stars)

@app.route('/profile/info', methods=['GET'])
def get_my_info():
	token = get_token(request)
	user_id = v.validate_token(token)

	return profile.get_info(user_id)

@app.route('/profile/info/<int:user_id>', methods=['GET'])
def get_user_info(user_id):
	token = get_token(request)
	v.validate_token(token)

	return profile.get_info(user_id)

# AVATAR
@app.route('/profile/avatar/preview', methods=['GET'])
def get_avatar_preview():
	token = get_token(request)
	user_id = v.validate_token(token)

	return avatar.get_avatar_preview(user_id)
     
@app.route('/profile/avatar/preview/<int:user_id>', methods=['GET'])
def get_target_avatar(user_id):
	token = get_token(request)
	v.validate_token(token)

	return avatar.get_avatar_preview(user_id)

@app.route('/profile/avatar/unlock', methods=['PUT'])
def unlock_attribute():
	token = get_token(request)
	user_id = v.validate_token(token)

	attribute = request.json['attribute']
	style = request.json['style']

	return avatar.unlock_attribute(user_id, attribute, style)

@app.route('/profile/avatar/update', methods=['PUT'])
def update_avatar():
	token = get_token(request)
	user_id = v.validate_token(token)

	attributes = request.json['attributes']

	return avatar.update_avatar(user_id, attributes)

@app.route('/profile/avatar/attributes', methods=['GET'])
def get_attributes():
	token = get_token(request)
	user_id = v.validate_token(token)

	return avatar.get_attributes(user_id)

# BADGES
@app.route('/profile/badges/tallies', methods=['GET'])
def get_tallies():
	token = get_token(request)
	user_id = v.validate_token(token)

	return badges.get_tallies(user_id)


@app.route('/profile/badges/update', methods=['PUT'])
def update_badges():
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