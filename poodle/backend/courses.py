
from flask import jsonify
from models import User, Course, Enrolment, UserSchema, db
from datetime import datetime, timedelta
from secrets import token_urlsafe
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import jwt

def create(course_name, user_id):
	existing_course = Course.query.filter_by(name=course_name).first()
	if existing_course:
		raise BadRequest('Course name already exists')

	new_course = Course(name=course_name, creator=user_id)

	db.session.add(new_course)
	db.session.commit()

	return jsonify({'message': 'Course created successfully', 'course_id': new_course.id}), 201
	
def invite(user_id, course_id, student_email):

	user_status = db.select([User.columns.is_teacher]).where(User.columns.user_id == user_id)

	if not user_status:
		raise NotFound('User permission denied')
	
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	student_id = User.query.filter_by(email=student_email).first()
	student = User.query.get(student_id)

	if not student:
		raise NotFound('Student not found')
	
	if course in student.courses:
		raise BadRequest('Student is already enrolled in the course')
	
	new_enrolment = Enrolment(user_id=student_id, course_id=course_id)
	db.session.add(new_enrolment)
	db.session.commit()

	return jsonify({'message': 'User enrolled in the course successfully'}), 200   

def fetch_courses(email):

	user_status = db.select([User.columns.is_teacher]).where(User.columns.email == email)
	user_id = db.select([User.columns.user_id]).where(User.columns.email == email)

	courses = []

	# Return List of Classes for Student
	if not user_status:
		course_ids = db.select([Enrolment.columns.course_id]).where(Enrolment.columns.user_id == user_id)

		for id in course_ids:
			course = Course.query.get(id)
			courses.append(course.course_name)
	# Return List of Classes for Teacher
	else:
		course_ids = db.select([Enrolment.columns.course_id]).where(Enrolment.columns.creator == user_id)

		for id in course_ids:
			course = Course.query.get(id)
			courses.append(course.course_name)

	return jsonify(courses)

def all_students(course_id):

	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	student_info = []
	
	student_ids = db.select([Enrolment.columns.user_id]).where(Enrolment.columns.course_id == course_id)

	for id in student_ids:
		student = User.query.get(id)
		student_info.append({'name': student.first_name.join(student.last_name), 'email': student.email})

	return jsonify(student_info)  

def create_class(course_id, class_name):

	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')	
	
	classes = course.active_classes
	class_list = classes.split("~")
	class_list.append(class_name)
	new_class_list = "~".join(class_list)

	course.active_classes = new_class_list
	db.commit()

	return jsonify({'message': 'Class successfully created'}), 200   

def all_classes(course_id):

	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')	
	
	classes = course.active_classes
	class_list = classes.split("~")
	
	return jsonify(class_list)   
	