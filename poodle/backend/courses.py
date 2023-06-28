
from flask import jsonify
from models import User, Course, Enrolment, UserSchema, OnlineClass, OnlineClassSchema, db 
from datetime import datetime, timedelta
from secrets import token_urlsafe
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import jwt

def create(course_name, user_id):
	existing_course = Course.query.filter_by(name=course_name).first()
	if existing_course:
		raise BadRequest('Course name already exists')
	
	user = User.query.get(user_id)

	if not user.is_teacher:
		raise Unauthorized('User permission denied')

	new_course = Course(name=course_name, creator=user_id)

	db.session.add(new_course)
	db.session.commit()

	return jsonify({'message': 'Course created successfully', 'course_id': new_course.id}), 201
	
def invite(user_id, course_id, student_email):
	user = User.query.get(user_id)

	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	student = User.query.filter_by(email=student_email).first()

	if student.is_teacher:
		raise BadRequest('Each course can only have one teacher')

	student_id = student.id

	if not student:
		raise NotFound('Student not found')
	
	enrolment = Enrolment.query.filter_by(user_id=student_id, course_id = course_id).first()
	
	if enrolment:
		raise BadRequest('Student is already enrolled in the course')
	
	new_enrolment = Enrolment(user_id=student_id, course_id=course_id)
	db.session.add(new_enrolment)
	db.session.commit()

	return jsonify({'message': 'User enrolled in the course successfully'}), 200   

def user_courses(user_id):
	course_list = []

	# Return List of Classes for Teacher
	if User.is_teacher:
		
		courses = Course.query.filter_by(creator=user_id).all()

		for course in courses:
			course_list.append(course.name)

	# Return List of Classes for Student
	else:
		course_enrolments = Course.query(Course).join(Enrolment).filter(Course.id == Enrolment.course_id).filter(Enrolment.user_id==user_id).all()
		for course in course_enrolments:
			course_list.append(course.name)

	return jsonify(course_list), 200

def all_students(course_id):
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	student_info = []

	enrolments = Enrolment.query.filter(Enrolment.course_id==course.id).all()

	for enrolment in enrolments:
		student = User.query.get(enrolment.user_id)
		student_info.append({'name': " ".join([student.first_name,student.last_name]), 'email': student.email})

	return jsonify(student_info), 200

def create_class(course_id, class_name):
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')	
	new_class = OnlineClass(name=class_name, course_id=course_id)
	
	db.session.add(new_class)
	db.session.commit()

	return jsonify({'message': 'Class successfully created'}), 200   

def all_classes(course_id):
	# Check if the course exists
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'message': 'Course not found'}), 404

    # Retrieve the online classes for the given course
    online_classes = OnlineClass.query.filter_by(course_id=course_id).all()
    online_class_schema = OnlineClassSchema()
    return online_class_schema.jsonify(online_classes, many=True), 200
	