from flask import jsonify
from models import *
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
	destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh', str(course_id), 'assignments', new_assignment.id)
	os.makedirs(destination)

	return jsonify({'message': 'Assignment created successfully', 'assignment_id': new_assignment.id}), 201

""" TO DO: Upload Spec, 

TO DO: Update Spec,

TO DO: Submit Assignment, 

TO DO: Update Mark, 

TO DO: Retrieve Mark, 

TO DO: Retrieve Submission (Filter, retrieve last submission)
Get all submissions from assignment_id, filter by student_id, sort in desc, and grab latest.
"""

def upload_spec(user_id, course_id, assignment_id, spec):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')

	assignment = User.query.get(assignment_id)

	# add entry to database
	date_created = datetime.now()
	new_file = File(folder_id=0, name="specification", date_created=date_created, file_path=destination)
	db.session.add(new_file)
	db.session.commit()

	assignment.spec_path = destination
	db.session.commit()
	
	# save locally to fsh content	
	unique_name = str(new_file.id)
	destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh', str(course_id), 'assignments', str(assignment_id), unique_name)
	spec.save(destination)

	return jsonify({'message': 'Assignment spec successfully uploaded', 'file_id': new_file.id}), 201

def update(user_id, course_id, assignment_id, spec):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')

	assignment = User.query.get(assignment_id)
	
	# save locally to fsh content	
	unique_name = str(new_file.id)
	destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh', str(course_id), 'assignments', str(assignment_id), unique_name)
	spec.save(destination)

	# add entry to database
	date_created = datetime.now()
	new_file = File(folder_id=0, name="specification", date_created=date_created, file_path=destination)
	db.session.add(new_file)
	db.session.commit()

	assignment.spec_path = destination
	db.session.commit()

	return jsonify({'message': 'Assignment spec updated uploaded', 'file_id': new_file.id}), 201

def submit(user_id, course_id, assignment_id, submission):
	user = User.query.get(user_id)
	
	if user.is_teacher:
		raise Unauthorized('User permission denied')
	
	assignment = User.query.get(assignment_id)

	# save locally to fsh content	
	unique_name = str(new_file.id)
	destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh', str(course_id), 'assignments', str(assignment_id), unique_name)
	submission.save(destination)

	# add entry to database
	date_created = datetime.now()
	new_file = File(folder_id=0, name=str(assignment_id).join(str(user_id)), date_created=date_created, file_path=destination)
	db.session.add(new_file)
	db.session.commit()

	new_submission = Submission(folder_id=0, name=str(assignment_id).join(str(user_id)), date_created=date_created, file_path=destination)
	db.session.add(new_file)
	db.session.commit()

	assignment.spec_path = destination
	db.session.commit()

	return jsonify({'message': 'Assignment successfully submitted at ' + date_created, 'file_id': new_file.id}), 201

def update_mark(user_id, course_id, spec, spec_path):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')

	new_assignment = Assignment(course_id=course_id, title=title,description=description, due_date=due_date, max_marks=max_marks)

	db.session.add(new_assignment)
	db.session.commit()
	
	# Make a new folder for the assignments
	destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh/ass', str(course_id), 'content', new_assignment.id)
	os.makedirs(destination)

	return jsonify({'message': 'Assignment created successfully', 'assignment_id': new_assignment.id}), 201

def retrieve_mark(user_id, course_id, spec, spec_path):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')

	new_assignment = Assignment(course_id=course_id, title=title,description=description, due_date=due_date, max_marks=max_marks)

	db.session.add(new_assignment)
	db.session.commit()
	
	# Make a new folder for the assignments
	destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh/ass', str(course_id), 'content', new_assignment.id)
	os.makedirs(destination)

	return jsonify({'message': 'Assignment created successfully', 'assignment_id': new_assignment.id}), 201

def retrieve_submission(user_id, course_id, spec, spec_path):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')

	new_assignment = Assignment(course_id=course_id, title=title,description=description, due_date=due_date, max_marks=max_marks)

	db.session.add(new_assignment)
	db.session.commit()
	
	# Make a new folder for the assignments
	destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh/ass', str(course_id), 'content', new_assignment.id)
	os.makedirs(destination)

	return jsonify({'message': 'Assignment created successfully', 'assignment_id': new_assignment.id}), 201

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

