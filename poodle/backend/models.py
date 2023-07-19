from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from sqlalchemy.orm import relationship
from sqlalchemy import LargeBinary
from sqlalchemy.ext.mutable import MutableDict, MutableList

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
	description = db.Column(db.String(1000), nullable=False)
	due_date = db.Column(db.DateTime, nullable=False)
	max_marks = db.Column(db.Integer, nullable=False)
	spec_file_id = db.Column(db.Integer, nullable=True)
	spec_name = db.Column(db.String(1000), nullable=True)
	submissions = relationship('Submission', backref='assignment', cascade='all, delete-orphan')

	def __init__(self, course_id, title, description, due_date, max_marks):
		self.course_id = course_id
		self.title = title
		self.description = description
		self.due_date = due_date
		self.max_marks = max_marks

class AssignmentSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'course_id', 'title', 'description', 'due_date', 'max_marks', 'spec_file_id', 'spec_name')	

class Submission(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	file_id = db.Column(db.Integer, nullable=False)
	assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.id'), nullable=False)
	student_id = db.Column(db.Integer, nullable=False)
	student_email = db.Column(db.String(120), unique=False, nullable=False)
	submission_time = db.Column(db.DateTime, nullable=False)
	score = db.Column(db.Integer, nullable=True)

	def __init__(self, file_id, assignment_id, student_id, student_email, submission_time):
		self.file_id = file_id
		self.assignment_id = assignment_id
		self.student_id = student_id
		self.student_email = student_email
		self.submission_time = submission_time

class SubmissionSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'file_id', 'assignment_id', 'student_id', 'student_email', 'submission_time', 'score')	

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
	course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
	due_date = db.Column(db.DateTime, nullable=False)
	name = db.Column(db.String(100), nullable=False)
	questions = db.Column(MutableList.as_mutable(db.JSON), default=list)
	time_limit = db.Column(db.Integer, nullable=False)
	is_deployed = db.Column(db.Boolean, default=False, nullable=False)

	def __init__(self, course_id, due_date, name, questions, time_limit, is_deployed):
		self.course_id = course_id
		self.due_date = due_date
		self.name = name
		self.questions = questions
		self.time_limit = time_limit
		self.is_deployed = is_deployed

class QuizSchema(ma.SQLAlchemySchema):
	class Meta:
		model = Quiz
		fields = ('quiz_id', 'course_id', 'due_date', 'name', 'questions', 'time_limit', 'is_deployed')


class QuizScore(db.Model):
	quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.quiz_id'), primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
	time_started = db.Column(db.DateTime, nullable=False)
	score = db.Column(db.Float, nullable=False)
	completed = db.Column(db.Boolean, default=False, nullable=False)

	def __init__(self, quiz_id, user_id, time_started, score):
		self.quiz_id = quiz_id
		self.user_id = user_id
		self.time_started = time_started
		self.score = score
		self.completed = False

class QuizScoreSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('quiz_id', 'user_id', 'time_started', 'score')

