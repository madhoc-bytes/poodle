
from flask import jsonify
from models import User, Course, Enrolment, Folder, OnlineClass, OnlineClassSchema, db 
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import os

# BASICS
def create(course_name, user_id):
	user = User.query.get(user_id)

	if not user.is_teacher:
		raise Unauthorized('User permission denied')

	new_course = Course(name=course_name, creator=user_id)

	db.session.add(new_course)
	db.session.commit()

	# create folder to store files for course in fsh
	path = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh', str(new_course.id))
	os.makedirs(path)	

	return jsonify({'message': 'Course created successfully', 'course_id': new_course.id}), 201

def id_to_name(course_id):
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')	
	return jsonify({'course_id': course.name}), 200

def invite(user_id, course_id, student_email):
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	user = User.query.get(user_id)
	student = User.query.filter_by(email=student_email).first()
 
	if not student:
		raise NotFound('Student not found')

	if not user.is_teacher:
		raise Unauthorized('User permission denied')

	if student.is_teacher:
		raise BadRequest('Each course can only have one teacher')

	student_id = student.id
	
	enrolment = Enrolment.query.filter_by(user_id=student_id, course_id = course_id).first()
	
	if enrolment:
		raise BadRequest('Student is already enrolled in the course')
	
	new_enrolment = Enrolment(user_id=student_id, course_id=course_id)
	db.session.add(new_enrolment)
	db.session.commit()

	return jsonify({'message': 'User enrolled in the course successfully'}), 200   

def user_courses(user_id):
	user = User.query.get(user_id)
	course_list = []

	# Return List of Classes for Teacher
	if user.is_teacher:	
		courses = Course.query.filter_by(creator=user_id).all()

		for course in courses:
			course_list.append({'name': course.name, 'id': course.id})

	# Return List of Classes for Student
	else:
		course_enrolments = db.session.query(Course).join(Enrolment, Course.id == Enrolment.course_id).filter(Enrolment.user_id == user_id).all()
  
		for course in course_enrolments:
			course_list.append({'name': course.name, 'id': course.id})

	return jsonify(course_list), 200

def all_students(course_id):
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	student_info = []

	enrolments = Enrolment.query.filter(Enrolment.course_id==course.id).all()

	for enrolment in enrolments:
		student = User.query.get(enrolment.user_id)
		student_info.append({'first_name': student.first_name, 'last_name': student.last_name, 'email': student.email})

	return jsonify(student_info), 200


def all_classes(course_id):
	# Check if the course exists
	course = Course.query.get(course_id)
	if not course:
		return jsonify({'message': 'Course not found'}), 404

	# Retrieve the online classes for the given course
	online_classes = OnlineClass.query.filter_by(course_id=course_id).all()
	online_class_schema = OnlineClassSchema()
	return online_class_schema.jsonify(online_classes, many=True), 200
