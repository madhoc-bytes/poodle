from flask import jsonify
from models import *
from .content import get_file
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import os

def create(user_id, course_id, title, description, due_date, max_marks):
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


def upload_spec(user_id, course_id, assignment_id, spec_file):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')

	assignment = User.query.get(assignment_id)

	if not assignment.spec_path:
		current_time = datetime.now()
		file = File(folder_id=0, name="specification", date_created=current_time, file_path='')
		db.session.add(file)
		db.session.commit()

		# save locally to fsh content	
		unique_name = str(file.id)
		destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh', str(course_id), 'assignments', str(assignment_id), unique_name)
		spec_file.save(destination)

		file.file_path = destination

		assignment.spec_path = destination
		db.session.commit()
	else:
		spec_id = assignment.spec_id
		spec = File.query.get(spec_id)
		destination = spec.file_path
		os.remove(destination)

		spec_file.save(destination)
		current_time = datetime.now()
		file.date_created = current_time
		db.session.commit()
	

	return jsonify({'message': 'Assignment spec successfully uploaded', 'file_id': file.id}), 201


def submit(user_id, course_id, assignment_id, submission_file):
	user = User.query.get(user_id)
	
	# teachers can't make submissions
	if user.is_teacher:
		raise Unauthorized('User permission denied')
	
	# cannot submit past the due date
	assignment = Assignment.query.get(assignment_id)
	if assignment.due_date < datetime.now():
		raise BadRequest('Assignment due date has passed')

	submission = Submission.query.filter_by(student_id=user_id, assignment_id = assignment_id)

	# if submission already exists, delete the old file and replace it with the new one
	if not submission:
		current_time = datetime.now()
		file = File(folder_id=0, name=str(assignment_id).join(str(user_id)), date_created=current_time, file_path="")
		db.session.add(file)
		db.session.commit()

		unique_name = str(file.id)
		destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh', str(course_id), 'assignments', str(assignment_id), unique_name)
		submission.save(destination)

		new_submission = Submission(folder_id=0, file_id = file.id, name=str(assignment_id).join(str(user_id)), date_created=current_time)
		db.session.add(new_submission)
		db.session.commit()

		file.file_path = destination
		db.session.commit()
	# else, create a new submission
	else:
		file = File.query.get(submission.file_id)
		destination = file.file_path
		os.remove(destination)

		submission_file.save(destination)
		current_time = datetime.now()
		file.date_created = current_time
		db.session.commit()
	
	return jsonify({'message': 'Assignment successfully submitted at ' + current_time, 'file_id': file.id}), 201


def update_score(user_id, submission_id, score):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	submission = Submission.query.get(submission_id)
	assignment = Assignment.query.get(submission.assignment_id)

	if score < 0 or score > assignment.max_mark:
		raise Unauthorized('Invalid Mark')
	
	submission.score = score
	db.session.commit()

	return jsonify({'message': 'Score updated successfully'}), 201


def fetch_score(user_id, submission_id):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')

	submission = User.query.get(submission_id)

	return jsonify({'message': 'Score successfully fetched', 'submission_mark': submission.mark}), 201


def fetch_submission(user_id, assignment_id, student_id):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	student = User.query.get(student_id)

	if student.is_teacher:
		raise Unauthorized('Invalid student')
	
	submission = Submission.query.filter_by(student_id=student_id, assignment_id = assignment_id).first()

	return get_file(submission.file_id)

