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

class UserSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'first_name', 'last_name', 'email', 'is_teacher')
	
class Course(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), unique=False, nullable=False)
	creator = db.Column(db.Integer, nullable=False)
	online_classes = relationship('OnlineClass', backref='course', cascade='all, delete-orphan')

	def __init__(self, name, creator):
		self.name = name
		self.creator = creator

class CourseSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Course

    id = ma.auto_field()
    name = ma.auto_field()
    creator = ma.auto_field()
    folders = ma.Nested('FolderSchema', many=True)


class Enrolment(db.Model):
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
	course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
	
	def __init__(self, user_id, course_id):
		self.user_id = user_id
		self.course_id = course_id

class EnrolmentSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('user_id', 'course_id')

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

class FolderSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Folder

    id = ma.auto_field()
    name = ma.auto_field()
    date_created = ma.auto_field()
    files = ma.Nested('FileSchema', many=True)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    folder_id = db.Column(db.Integer, db.ForeignKey('folder.id'), nullable=False)
    name = db.Column(db.String(100), unique=False, nullable=False)
    date_created = db.Column(db.Date, nullable=False)
    data = db.Column(LargeBinary, nullable=False)

    def __init__(self, folder_id, name, date_created, data):
        self.folder_id = folder_id
        self.name = name
        self.date_created = date_created
        self.data = data


class FileSchema(ma.SQLAlchemySchema):
    class Meta:
        model = File

    id = ma.auto_field()
    name = ma.auto_field()
    date_created = ma.auto_field()
    data = ma.auto_field()

class OnlineClass(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), unique=True, nullable=False)
	course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
	
	def __init__(self, name, course_id):
		self.course_id = course_id
		self.name = name

class OnlineClassSchema(ma.SQLAlchemySchema):
	class Meta:
		model = OnlineClass
		fields = ('id', 'name','course_id')


	