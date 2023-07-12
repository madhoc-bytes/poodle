from flask import jsonify
from models import User, Course, Enrolment, Assignment, Question, Answer, UserSchema, AssignmentSchema, CourseSchema, db
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import os

def create_assignment(user_id, course_id, title, description, due_date, max_marks):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	if not course_id:
		raise BadRequest('Course ID cannot be empty')
	
	if not title:
		raise BadRequest('Title cannot be empty')
	
	if not description:
		raise BadRequest('Description cannot be empty')
	
	if not due_date:
		raise BadRequest('Due date cannot be empty')
	
	if not max_marks:
		raise BadRequest('Maximum marks cannot be empty')	
	

	new_assignment = Assignment(course_id=course_id, title=title,description=description, due_date=due_date, max_marks=max_marks)

	db.session.add(new_assignment)
	db.session.commit()
	
	# Make a new folder for the assignments
	destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh/ass', str(course_id), 'content', new_assignment.id)
	os.makedirs(destination)

	return jsonify({'message': 'Assignment created successfully', 'assignment_id': new_assignment.id}), 201

# TO DO: Upload Spec, Submit Assignment, Update Mark, Retrieve Mark, Retrieve Submission (Filter, retrieve last submission)
# Get all submissions from assignment_id, filter by student_id, sort in desc, and grab latest.

def get_assignments_course(user_id, course_id):
	user = User.query.get(user_id)
	course = Course.query.get(course_id)
	ass_list = []

	if not user:
		raise NotFound('User not found')
	
	if not course:
		raise NotFound('Course not found')
	
	# Return list of assignments for teacher
	if user.is_teacher:
		# Check teacher is creator of course
		if course.creator != user_id:
			raise Unauthorized('User permission denied')
		
		asses = Assignment.query.filter_by(creator=user_id, course_id=course_id).all()
		
		for ass in asses:
			ass_list.append({'title' : ass.title, 'id': ass.ass_id, 'due_date': ass.due_date})
	# Return list of assignments for student
	else:
		# Check student is in course
		course_enrolments = db.session.query(Course).join(Enrolment, Course.id == Enrolment.course_id).filter(Enrolment.user_id == user_id).all()

		if course not in course_enrolments:
			raise Unauthorized('User permission denied')

		asses = Assignment.query.filter_by(creator=user_id, course_id=course_id).all()
		
		for ass in asses:
			ass_list.append({'title' : ass.title, 'id': ass.ass_id, 'due_date': ass.due_date})

	return jsonify(ass_list), 200

def all_ass(course_id):
	# Check if the course exists
	course = Course.query.get(course_id)
	if not course:
		return jsonify({'message': 'Course not found'}), 404

	# Retrieve the online classes for the given course
	ass = Assignment.query.filter_by(course_id=course_id).all()
	ass_schema = AssignmentSchema()
	return ass_schema.jsonify(ass, many=True), 200

def get_ass_name(course_id, ass_id):
	ass = Assignment.query.get(ass_id)
	if not ass:
		raise NotFound('Assignment not found')
	
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	if ass.course_id != course_id:
		raise Unauthorized('User permission denied')
	
	return jsonify({'name': ass.name}), 200

