
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

	user = User.query().get(user_id).first()

	if not user.is_teacher:
		raise NotFound('User permission denied')
	
	course = Course.query().get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	student = User.query().filter_by(email=student_email).first()
	student_id = student.user_id

	if not student:
		raise NotFound('Student not found')
	
	enrolment = Enrolment.query.filter_by(user_id=student_id, course_id = course_id).first()
	
	if enrolment:
		raise BadRequest('Student is already enrolled in the course')
	
	new_enrolment = Enrolment(user_id=student_id, course_id=course_id)
	db.session.add(new_enrolment)
	db.session.commit()

	return jsonify({'message': 'User enrolled in the course successfully'}), 200   

def fetch_courses(email):

	User = User.query().filter_by(email=email).first()
	user_id = User.id

	course_list = []

	# Return List of Classes for Teacher
	if User.is_teacher:
		
		courses = Course.query().filter_by(creator=user_id).all()

		for course in courses:
			course_list.append(course.course_name)

	# Return List of Classes for Student
	else:
		course_enrolments = Course.query(Course).join(Enrolment).filter(Course.id == Enrolment.course_id).filter(Enrolment.user_id==user_id).all()
		for course in course_enrolments:
			course_list.append(course.course_name)

	return jsonify(course_list), 200

def all_students(course_id):

	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	student_info = []

	enrolments = Enrolment.query().filter(Enrolment.course_id==course_id).all()

	for enrolment in enrolments:
		student = User.query.get(enrolment.user_id)
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
	