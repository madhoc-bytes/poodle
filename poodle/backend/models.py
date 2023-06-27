from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

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

class UserSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'first_name', 'last_name', 'email', 'is_teacher')
	
class Course(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	course_name = db.Column(db.String(100), unique=True, nullable=False)
	creator = db.Column(db.Integer, nullable=False)
	active_classes = db.Column(db.String(1000), nullable=True)

	def __init__(self, name, creator_id):
		self.name = name
		self.creator = creator_id
		active_classes = str()

class CourseSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'course_name', 'creator', 'active_classes')
	

class Enrolment(db.Model):
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
	course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
	
	def __init__(self, user_id, course_id):
		self.user_id = user_id
		self.course_id = course_id

class EnrolmentSchema(db.Model):
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
	course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
	