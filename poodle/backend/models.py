from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from sqlalchemy.orm import relationship
from sqlalchemy import LargeBinary

db = SQLAlchemy()
ma = Marshmallow()


'''
Schemas to define for making queries: 

course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)
folder_schema = FolderSchema()
folders_schema = FolderSchema(many=True)
file_schema = FileSchema()
files_schema = FileSchema(many=True)
'''

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	first_name = db.Column(db.String(50), nullable=False)
	last_name = db.Column(db.String(50), nullable=False)
	email = db.Column(db.String(120), unique=True, nullable=False)
	password = db.Column(db.String(100), nullable=False)
	is_teacher = db.Column(db.Boolean, default=False, nullable=False)

	def __init__(self, first_name, last_name, email, password, is_teacher):
		self.first_name = first_name
		self.last_name = last_name
		self.email = email
		self.password = password
		self.is_teacher = is_teacher


class Course(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), unique=False, nullable=False)
	creator = db.Column(db.Integer, nullable=False)
	online_classes = relationship('OnlineClass', backref='course', cascade='all, delete-orphan')
	folders = relationship('Folder', backref='course', cascade='all, delete-orphan')
	assignments = relationship('Assignment', backref='course', cascade='all, delete-orphan')

	def __init__(self, name, creator):
		self.name = name
		self.creator = creator

class Assignment(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
	title = db.Column(db.String(100), nullable=False)
	description = db.Column(db.String(1000), nullable=True)
	due_date = db.Column(db.DateTime, nullable=False)
	max_marks = db.Column(db.Integer, nullable=False)
	spec_file_path = db.Column(db.String(100), unique=False, nullable=True)
	submissions = relationship('Submission', backref='assignment', cascade='all, delete-orphan')

	def __init__(self, course_id, title, description, due_date, max_marks):
		self.course_id = course_id
		self.title = title
		self.description = description
		self.due_date = due_date
		self.max_marks = max_marks

class AssignmentSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'course_id', 'title', 'description', 'due_date', 'max_marks', 'spec_file_path')	

class Submission(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.id'), nullable=False)
	student_id = db.Column(db.Integer, nullable=False)
	submission_time = db.Column(db.DateTime, nullable=False)
	file_path = db.Column(db.String(100), unique=False, nullable=False)
	score = db.Column(db.Float, nullable=True)

	def __init__(self, assignment_id, student_id, submission_time, file_path):
		self.assignment_id = assignment_id
		self.student_id = student_id
		self.submission_time = submission_time
		self.file_path = file_path

class SubmissionSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'assignment_id', 'student_id', 'submission_time', 'file_path', 'score')	

class Enrolment(db.Model):
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
	course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
	
	def __init__(self, user_id, course_id):
		self.user_id = user_id
		self.course_id = course_id

class Folder(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
	name = db.Column(db.String(100), unique=False, nullable=False)
	date_created = db.Column(db.Date, nullable=False)
	files = relationship('File', backref='folder', cascade='all, delete-orphan')

	def __init__(self, course_id, name, date_created):
		self.course_id = course_id
		self.name = name
		self.date_created = date_created


class File(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	folder_id = db.Column(db.Integer, db.ForeignKey('folder.id'), nullable=False)
	name = db.Column(db.String(100), unique=False, nullable=False)
	date_created = db.Column(db.Date, nullable=False)
	file_path = db.Column(db.String(100), unique=False, nullable=False)

	def __init__(self, folder_id, name, date_created, file_path):
		self.folder_id = folder_id
		self.name = name
		self.date_created = date_created
		self.file_path = file_path

class OnlineClass(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), unique=True, nullable=False)
	course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
	
	def __init__(self, name, course_id):
		self.course_id = course_id
		self.name = name

class UserSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'first_name', 'last_name', 'email', 'is_teacher')

class FileSchema(ma.SQLAlchemyAutoSchema):
	class Meta:
		model = File

class FolderSchema(ma.SQLAlchemyAutoSchema):
	class Meta:
		model = Folder
		include_relationships = True

	files = ma.Nested(FileSchema, many=True)

class CourseSchema(ma.SQLAlchemyAutoSchema):
	class Meta:
		model = Course
		include_relationships = True

	folders = ma.Nested(FolderSchema, many=True)

class EnrolmentSchema(ma.SQLAlchemySchema):
	class Meta:
		model = Enrolment
		fields = ('user_id', 'course_id')	

class OnlineClassSchema(ma.SQLAlchemySchema):
	class Meta:
		model = OnlineClass
		fields = ('id', 'name','course_id')

class Quiz(db.Model):
	quiz_id = db.Column(db.Integer, primary_key=True)
	creator = db.Column(db.Integer, nullable=False)
	course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
	name = db.Column(db.String(100), nullable=False)
	due_date = db.Column(db.DateTime, nullable=False)
	
	def __init__(self, creator, course_id, name, due_date):
		self.creator = creator
		self.course_id = course_id
		self.name = name
		self.due_date = due_date

class QuizSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('quiz_id', 'creator', 'course_id', 'name', 'due_date')

class Question(db.Model) :
	question_id = db.Column(db.Integer, primary_key=True)
	quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.quiz_id'), nullable=False)
	question = db.Column(db.String(300), nullable=False)
	time_limit = db.Column(db.Integer, nullable=False)
	points = db.Column(db.Integer, nullable=False)
	is_multi = db.Column(db.Boolean, nullable=False)

	def __init__(self, quiz_id, question, time_limit, points, is_multi):
		self.quiz_id = quiz_id
		self.question = question
		self.time_limit = time_limit
		self.points = points
		self.is_multi = is_multi
		
class QuestionSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('question_id', 'quiz_id', 'question', 'time_limit', 'points', 'is_multi')

class Answer(db.Model):
	answer_id = db.Column(db.Integer, primary_key=True)
	question_id = db.Column(db.Integer, db.ForeignKey('question.question_id'), nullable=False)
	answer = db.Column(db.String(300), nullable=False)
	is_correct = db.Column(db.Boolean, nullable=False)

	def __init__(self, question_id, answer, is_correct):
		self.question_id = question_id
		self.answer = answer
		self.is_correct = is_correct

class AnswerSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('answer_id', 'question_id', 'answer', 'is_correct')

class QuizAttempt(db.Model):
	quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.quiz_id'), primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
	score = db.Column(db.Integer, nullable=False)

	def __init__(self, quiz_id, user_id, score):
		self.quiz_id = quiz_id
		self.user_id = user_id
		self.score = score

class QuizAttemptSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('quiz_id', 'user_id', 'score')
