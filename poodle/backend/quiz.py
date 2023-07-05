from flask import jsonify
from models import User, Course, Enrolment, Quiz, Question, Answer, QuizAttempt, UserSchema, QuizSchema, QuestionSchema, AnswerSchema, QuizAttemptSchema, db
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound

def create_quiz(quiz_name, user_id, course_id, due_date):
	user = User.query.get(user_id)

	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	if not course_id:
		raise BadRequest('Course ID cannot be empty')

	if not quiz_name:
		raise BadRequest('Quiz name cannot be empty')
	
	if not due_date:
		raise BadRequest('Due date cannot be empty')
	
	new_quiz = Quiz(creator=user_id, course_id=course_id, name=quiz_name, due_date=due_date)

	db.session.add(new_quiz)
	db.session.commit()

	return jsonify({'message': 'Quiz created successfully', 'quiz_id': new_quiz.id}), 201

def create_question(course_id, quiz_id, question_text, time_limit, points, is_multi):
	quiz = Quiz.query.get(quiz_id)
	if not quiz:
		raise NotFound('Quiz not found')
	
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	if quiz.course_id != course_id:
		raise Unauthorized('User permission denied')

	if not question_text:
		raise BadRequest('Question text cannot be empty')
	
	if not time_limit:
		raise BadRequest('Time limit cannot be empty')
	
	if not points:
		raise BadRequest('Points cannot be empty')
	
	new_question = Question(question=question_text, quiz_id=quiz_id, time_limit=time_limit, points=points, is_multi=is_multi)
	db.session.add(new_question)
	db.session.commit()

	return jsonify({'message': 'Question created successfully', 'question_id': new_question.id}), 201

def create_answer(course_id, quiz_id, question_id, answer_text, is_correct):
	quiz = Quiz.query.get(quiz_id)
	if not quiz:
		raise NotFound('Quiz not found')
	
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	if quiz.course_id != course_id:
		raise Unauthorized('User permission denied')
	
	question = Question.query.get(question_id)
	if not question:
		raise NotFound('Question not found')
	
	if question.quiz_id != quiz_id:
		raise Unauthorized('User permission denied')
	
	if not answer_text:	
		raise BadRequest('Answer text cannot be empty')
	
	answer_list = get_quiz_question_answers(course_id, quiz_id, question_id)
	if len(answer_list) >= 4:
		raise BadRequest('Question already has 4 answers')

	new_answer = Answer(answer=answer_text, question_id=question_id, is_correct=is_correct)
	db.session.add(new_answer)
	db.session.commit()

	return jsonify({'message': 'Answer created successfully', 'answer_id': new_answer.id}), 201


def user_quizzes_course(user_id, course_id):
	user = User.query.get(user_id)
	course = Course.query.get(course_id)
	quiz_list = []

	if not user:
		raise NotFound('User not found')

	# Return List of Quizzes for Teacher
	if user.is_teacher:	
		# Check teacher is creator of course
		if course.creator != user_id:
			raise Unauthorized('User permission denied')
		
		quizzes = Quiz.query.filter_by(creator=user_id, course_id=course_id).all()

		for quiz in quizzes:
			quiz_list.append({'name': quiz.name, 'id': quiz.id})

	# Return List of Quizzes for Student
	else:
		# Check student is in course
		course_enrolments = db.session.query(Course).join(Enrolment, Course.id == Enrolment.course_id).filter(Enrolment.user_id == user_id).all()

		if course not in course_enrolments:
			raise Unauthorized('User permission denied')

		quizzes = Quiz.query.filter_by(course_id=course_id).all()
		for quiz in quizzes:
			quiz_list.append({'name': quiz.name, 'id': quiz.id})

	return jsonify(quiz_list), 200

def get_quiz_name(course_id, quiz_id):
	quiz = Quiz.query.get(quiz_id)
	if not quiz:
		raise NotFound('Quiz not found')
	
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	if quiz.course_id != course_id:
		raise Unauthorized('User permission denied')

	return jsonify({'name': quiz.name}), 200

def get_quiz_questions(course_id, quiz_id):
	quiz = Quiz.query.get(quiz_id)
	if not quiz:
		raise NotFound('Quiz not found')
	
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	if quiz.course_id != course_id:
		raise Unauthorized('User permission denied')
	
	# Return list of questions corresponding to quiz
	questions = Question.query.filter_by(quiz_id=quiz_id).all()

	return jsonify(QuestionSchema(many=True).dump(questions)), 200

def get_quiz_question_answers(course_id, quiz_id, question_id):
	quiz = Quiz.query.get(quiz_id)
	if not quiz:
		raise NotFound('Quiz not found')
	
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	if quiz.course_id != course_id:
		raise Unauthorized('User permission denied')
	
	question = Question.query.get(question_id)
	if not question:
		raise NotFound('Question not found')
	
	if question.quiz_id != quiz_id:
		raise Unauthorized('User permission denied')
	
	# Return list of answers corresponding to question
	answers = Answer.query.filter_by(question_id=question_id).all()

	return jsonify(AnswerSchema(many=True).dump(answers)), 200