from flask import jsonify
from models import User, Course, Quiz, QuizScore, Enrolment, QuizSchema, QuizScoreSchema, db
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import json

def create_quiz(user_id, course_id, quiz_name, due_date, time_limit):
	user = User.query.get(user_id)
	course = Course.query.get(course_id)

	if not user:
		raise NotFound('User not found')

	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	if not course_id:
		raise BadRequest('Course ID cannot be empty')

	if not quiz_name:
		raise BadRequest('Quiz name cannot be empty')
	
	if not due_date:
		raise BadRequest('Due date cannot be empty')
	
	if not time_limit:
		raise BadRequest('Time limit cannot be empty')
	
	if course.creator != user_id:
		raise Unauthorized('Teacher is not creator of the course')
	
	due_datetime = datetime.strptime(due_date, '%Y-%m-%dT%H:%M')
	new_quiz = Quiz(course_id=course_id, due_date=due_datetime, name=quiz_name, questions=[], time_limit=time_limit, is_deployed=False)

	db.session.add(new_quiz)
	db.session.commit()

	return jsonify({'message': 'Quiz created successfully', 'quiz_id': new_quiz.quiz_id}), 201

def update_quiz(user_id, quiz_id, quiz_name, due_date, time_limit, questions):
	user = User.query.get(user_id)
	quiz = Quiz.query.get(quiz_id)

	if not quiz:
		raise NotFound('Quiz not found')
	
	course_id = quiz.course_id
	course = Course.query.get(course_id)

	if not user:
		raise NotFound('User not found')

	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	if not quiz_id:
		raise BadRequest('Quiz ID cannot be empty')
	
	if course.creator != user_id:
		raise Unauthorized('Teacher is not creator of the course')

	if quiz.is_deployed:
		raise BadRequest('Quiz has already been deployed')
	
	if quiz_name:
		quiz.name = quiz_name
	
	if due_date:
		if len(due_date) == 16:
			quiz.due_date = datetime.strptime(due_date, '%Y-%m-%dT%H:%M')
		else:
			quiz.due_date = datetime.strptime(due_date, '%Y-%m-%dT%H:%M:%S')
	
	if time_limit:
		quiz.time_limit = time_limit
  
	if questions:
		quiz.questions = questions
	else:
		quiz.questions = []
  
	db.session.commit()

	return jsonify({'message': 'Quiz updated successfully'}), 200

def create_question(user_id, quiz_id, question_name, is_multi, answers, correct_answer):
	user = User.query.get(user_id)
	quiz = Quiz.query.get(quiz_id)

	if not quiz:
		raise NotFound('Quiz not found')

	course_id = quiz.course_id
	course = Course.query.get(course_id)

	if not user:
		raise NotFound('User not found')

	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	if not quiz_id:
		raise BadRequest('Quiz ID cannot be empty')
	
	if course.creator != user_id:
		raise Unauthorized('Teacher is not creator of the course')
	
	if quiz.is_deployed:
		raise BadRequest('Quiz has already been deployed')
	
	if not question_name:
		raise BadRequest('Question name cannot be empty')
	
	if is_multi and not answers:
		raise BadRequest('Answers cannot be empty')

	if not correct_answer:
		raise BadRequest('Correct answers cannot be empty')
	
	if not course:
		raise NotFound('Course not found')

	new_question = {
		"question": question_name,
		"is_multi": is_multi,
		"answers": answers,
		"correct_answer": correct_answer
	}

	quiz_list = quiz.questions
	quiz_list.append(new_question)
	# quiz.questions = json.dumps(quiz_dict)
	# new_questions_json = json.loads(quiz.questions).append(json.dumps(new_question))
	# Quiz.query.get(quiz_id).update('questions', quiz_dict)
	db.session.commit()

	return jsonify({'message': 'Question created successfully'}), 201

def delete_quiz(user_id, quiz_id):
	user = User.query.get(user_id)
	quiz = Quiz.query.get(quiz_id)
	course_id = quiz.course_id
	course = Course.query.get(course_id)

	if not course:
		raise NotFound('Course not found')
	
	if not user:
		raise NotFound('User not found')

	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	if not quiz_id:
		raise BadRequest('Quiz ID cannot be empty')
	
	if course.creator != user_id:
		raise Unauthorized('Teacher is not creator of the course')

	if not quiz:
		raise NotFound('Quiz not found')
	
	if quiz.is_deployed:
		raise BadRequest('Quiz has already been deployed')
	
	Quiz.query.filter(Quiz.quiz_id==quiz_id).delete()
	db.session.commit()

	return jsonify({'message' : 'Quiz deleted successfully'}), 200

def get_quiz_names_teacher(user_id, course_id):
	user = User.query.get(user_id)
	course = Course.query.get(course_id)

	if not course:
		raise NotFound('Course not found')

	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	if course.creator != user_id:
		raise Unauthorized('Teacher is not creator of the course')

	quizzes = Quiz.query.filter_by(course_id=course_id).all()
	quiz_info = []
  
	for quiz in quizzes:
		quiz_info.append({'id': quiz.quiz_id, 'name': quiz.name, 'deployed': quiz.is_deployed})

	return jsonify(quiz_info), 200

def get_quiz_info(user_id, quiz_id):
	user = User.query.get(user_id)

	quiz = Quiz.query.get(quiz_id)
	if not quiz:
		raise NotFound('Quiz not found')

	course_id = Quiz.query.get(quiz_id).course_id
	course = Course.query.get(course_id)

	if not user:
		raise NotFound('User not found')
	
	if not course:
		raise NotFound('Course not found')

	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	if course.creator != user_id:
		raise Unauthorized('Teacher is not creator of the course')
	
	if quiz.is_deployed:
		raise BadRequest('Quiz has already been deployed')

	return jsonify({'message' : 'Quiz info retrieved successfully', 'quiz' : QuizSchema().dump(quiz)}), 200

def deploy_quiz(user_id, quiz_id):
	user = User.query.get(user_id)

	quiz = Quiz.query.get(quiz_id)
	if not quiz:
		raise NotFound('Quiz not found')

	course_id = Quiz.query.get(quiz_id).course_id
	course = Course.query.get(course_id)

	if not user:
		raise NotFound('User not found')
	
	if not course:
		raise NotFound('Course not found')

	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	if course.creator != user_id:
		raise Unauthorized('Teacher is not creator of the course')

	quiz.is_deployed = True
	db.session.commit()

	return jsonify({'message' : 'Quiz deployed successfully'}), 200

def create_quiz_score(user_id, quiz_id):
	user = User.query.get(user_id)
	quiz = Quiz.query.get(quiz_id)
	if not quiz:
		raise NotFound('Quiz not found')

	course_id = Quiz.query.get(quiz_id).course_id
	course = Course.query.get(course_id)

	if not course:
		raise NotFound('Course not found')
	
	if not user:
		raise NotFound('User not found')
	
	if user.is_teacher:
		raise Unauthorized('User permission denied')
	
	if not quiz.is_deployed:
		raise BadRequest('Quiz has not been deployed yet')
	
	curr_dt = datetime.now()
	# timestamp = int(round(curr_dt.timestamp()))
	
	new_quiz_score = QuizScore(user_id=user_id, quiz_id=quiz_id, time_started=curr_dt, score=0)

	db.session.add(new_quiz_score)
	db.session.commit()

	return jsonify({'message': 'Quiz score created successfully'}), 201

def get_quiz_score(user_id, course_id):
	user = User.query.get(user_id)
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	if not user:
		raise NotFound('User not found')
	
	if user.is_teacher:
		raise Unauthorized('User permission denied')
	
	enrolment = Enrolment.query.filter_by(user_id=user_id, course_id=course_id).first()

	if not enrolment:
		raise Unauthorized('User is not enrolled in the course')
	
	quizzes = Quiz.query.filter_by(course_id=course_id).all()

	quiz_student_list = []

	for quiz in quizzes:
		quiz_score = QuizScore.query.filter_by(user_id=user_id, quiz_id=quiz.quiz_id).first()
		quiz_dict = {}

		if quiz.is_deployed:
			if not quiz_score:
				if quiz.due_date < datetime.now():
					quiz_dict = {"name" : quiz.name, 
					"score" : None,
					"dueDate" : quiz.due_date,
					"status" : "Past due date",
					"maxMarks": len(quiz.questions),
					"timeLimit": quiz.time_limit}
				else:
					# Quiz hasn't been attempted
					quiz_dict = {"name" : quiz.name, 
					"score" : None,
					"dueDate" : quiz.due_date,
					"status" : "Not attempted",
					"maxMarks": len(quiz.questions),
					"timeLimit": quiz.time_limit,
					"id": quiz.quiz_id}
			# if quiz is being attempted
			elif (not quiz_score.completed and quiz_score.time_started.timestamp() 
         + quiz.time_limit*60) > int(datetime.now().timestamp()):
				quiz_dict = {"name" : quiz.name, 
				"score" : quiz_score.score,
				"dueDate" : quiz.due_date,
				"status" : "In progress",
				"maxMarks": len(quiz.questions),
				"timeLimit": quiz.time_limit,
				"id": quiz.quiz_id}
			# Quiz time has finished
			else:
				quiz_dict = {"name" : quiz.name, 
				"score" : quiz_score.score,
				"dueDate" : quiz.due_date,
				"status" : "Completed",
				"maxMarks": len(quiz.questions),
				"timeLimit": quiz.time_limit}
			
			quiz_student_list.append(quiz_dict)
	
	return quiz_student_list, 200


def update_quiz_score(user_id, quiz_id, score):
	user = User.query.get(user_id)
	quiz = Quiz.query.get(quiz_id)
	if not quiz:
		raise NotFound('Quiz not found')

	quiz_score = QuizScore.query.filter_by(user_id=user_id, quiz_id=quiz_id).first()
	
	if not user:
		raise NotFound('User not found')
	
	if user.is_teacher:
		raise Unauthorized('User permission denied')

	if quiz_score.completed:
		raise Unauthorized('User permission denied')
	
	if not quiz_score:
		raise NotFound('Quiz score not found')
	
	quiz_score.score = score
	db.session.commit()
	return jsonify({'message' : 'Quiz score updated successfully'}), 200
	
def get_quiz_info_student(user_id, quiz_id):
	user = User.query.get(user_id)

	quiz = Quiz.query.get(quiz_id)
	if not quiz:
		raise NotFound('Quiz not found')

	if not user:
		raise NotFound('User not found')

	if user.is_teacher:
		raise Unauthorized('User permission denied')
	
	quiz_score = QuizScore.query.filter_by(user_id=user_id, quiz_id=quiz_id).first()
	if not quiz_score:
		raise NotFound('Quiz score not found')
	
	quiz_info = {
		"name" : quiz.name,
		"questions" : quiz.questions,
		"timeStarted" : quiz_score.time_started,
		"timeLimit" : quiz.time_limit,
		"dueDate" : quiz.due_date,
	}

	return jsonify({'message' : 'Quiz info retrieved successfully', 'quizInfo' : quiz_info}), 200

def submit_quiz(user_id, quiz_id):
	quiz_score = QuizScore.query.filter_by(user_id=user_id, quiz_id=quiz_id).first()
 
	quiz_score.completed = True

	db.session.commit()
 
	return jsonify({'message' : "Quiz complete"}), 200