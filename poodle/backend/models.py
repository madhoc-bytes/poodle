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
    name = db.Column(db.String(100), unique=True, nullable=False)
    #TODO: add course creator attribute

class UserCourse(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)