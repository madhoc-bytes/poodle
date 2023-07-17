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

def upload_spec(user_id, assignment_id, spec_file):
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
		destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh', str(assignment.course_id), 'assignments', str(assignment_id), unique_name)
		spec_file.save(destination)

		file.file_path = destination

		assignment.spec_path = destination
		db.session.commit()
		return jsonify({'message': 'Assignment spec successfully uploaded', 'file_id': file.id}), 201
	else:
		spec_id = assignment.spec_id
		spec = File.query.get(spec_id)
		destination = spec.file_path
		os.remove(destination)

		spec_file.save(destination)
		current_time = datetime.now()
		file.date_created = current_time
		db.session.commit()	
		return jsonify({'message': 'Assignment spec successfully updated', 'file_id': file.id}), 201

# get assignments 
def get_assignments(user_id, course_id):
	user = User.query.get(user_id)

	#check if user in the course
	enrolment = Enrolment.query.filter_by(user_id=user_id, course_id=course_id).first()
	if not enrolment:
		raise Unauthorized('User not enrolled in course')

	assignments = Assignment.query.filter_by(course_id=course_id).all()
	assignment_schema = AssignmentSchema(many=True)
	
	# remove list of submissions 
	for assignment in assignments:
		del assignment.submissions

	return jsonify(assignment_schema.dump(assignments)), 201

def submit(user_id, assignment_id, submission_file):
	user = User.query.get(user_id)
	
	# teachers can't make submissions
	if user.is_teacher:
		raise Unauthorized('User permission denied')
	
	# cannot submit past the due date
	assignment = Assignment.query.get(assignment_id)
	if assignment.due_date < datetime.now():
		raise BadRequest('Assignment due date has passed')
	
	submission = Submission.query.filter_by(student_id=user_id, assignment_id = assignment_id)

	# if there isn't a submission already, create a new one
	if not submission:
		current_time = datetime.now()
		file = File(folder_id=0, name="submission", date_created=current_time, file_path='')
		db.session.add(file)
		db.session.commit()

		# save locally to fsh content	
		unique_name = str(file.id)
		destination = os.path.join(os.getcwd(), 'poodle/backend/courses/fsh', str(assignment.course_id), 'assignments', str(assignment_id), unique_name)
		submission_file.save(destination)

		file.file_path = destination
		student_email = User.email

		new_submission = Submission(file_id=file.id, assignment_id=assignment_id, student_id=user_id, student_email = student_email, submission_time=current_time)
		db.session.add(new_submission)
		db.session.commit()

	# if submission already exists, delete the old file and replace it with the new one
	else:
		file = File.query.get(submission.file_id)
		destination = file.file_path
		os.remove(destination)

		submission_file.save(destination)
		current_time = datetime.now()
		file.date_created = current_time
		db.session.commit()
	
	return jsonify({'message': 'Assignment successfully submitted at ' + current_time, 'file_id': file.id}), 201

# get all submissions for an assignment
def all_submissions(user_id, assignment_id):
	user = User.query.get(user_id)
	
	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	# if assignment due date has passed, create dummy submissions for students who haven't submitted
	current_time = datetime.now()
	if current_time > assignment.due_date:
		# get course id from assignment id
		assignment = Assignment.query.get(assignment_id)
		course_id = assignment.course_id
		
		# get all students enrolled in the course
		enrolments = Enrolment.query.filter_by(course_id=course_id).all()

		# create a dummy submissions for students who haven't submitted
		for enrolment in enrolments:
			student_id = enrolment.user_id
			submission = Submission.query.filter_by(student_id=student_id, assignment_id=assignment_id).first()
			if not submission:
				current_time = datetime.now()
				file = File(folder_id=0, name="submission", date_created=current_time, file_path='')
				db.session.add(file)
				db.session.commit()

				new_submission = Submission(file_id=file.id, assignment_id=assignment_id, student_id=student_id, submission_time=current_time)
				db.session.add(new_submission)
				db.session.commit()

	submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
	submission_schema = SubmissionSchema(many=True)

	return jsonify(submission_schema.dump(submissions)), 201

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

	return jsonify({'message': 'Score successfully fetched', 'submission_mark': submission.score}), 201

