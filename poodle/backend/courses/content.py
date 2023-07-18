from flask import jsonify, send_file
from models import User, Course, CourseSchema, File, Folder, FolderSchema, Enrolment, db 
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import os

# FOLDERS
def create_folder(folder_name, user_id, course_id):
	user = User.query.get(user_id)
	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')	
	
	date_created = datetime.now()

	new_folder = Folder(course_id=course_id, name=folder_name, date_created=date_created)
	course.folders.append(new_folder)

	db.session.add(new_folder)
	db.session.commit()

	return jsonify({'message': 'Folder successfully created', 'folder_id': new_folder.id}), 200

def create_file(file_name, user_id, folder_id, file):
	user = User.query.get(user_id)
	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	folder = Folder.query.get(folder_id)
	if not folder:
		raise NotFound('Folder not found')
	
	# add entry to database
	date_created = datetime.now()
	new_file = File(folder_id=folder_id, name=file_name, date_created=date_created, file_path='')
	db.session.add(new_file)
	db.session.commit()
	
	# save locally to fsh content	
	unique_name = str(new_file.id) + ' ' + file_name
	destination = os.path.join(os.getcwd(), 'poodle/frontend/public/fsh', str(folder.course_id), 'content' ,unique_name)
	file.save(destination)

	# update file_path in database
	new_file.file_path = destination
	db.session.commit()

	return jsonify({'message': 'File uploaded successfully', 'file_id' : new_file.id}), 200

def get_course_content(user_id, course_id):
	user = User.query.get(user_id)
	enrolment = Enrolment.query.filter_by(user_id=user_id, course_id = course_id).first()
	if not user.is_teacher and not enrolment:
		raise Unauthorized('User permission denied')
	
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course does not exist')

	course_schema = CourseSchema()
	folders = course_schema.dump(course)['folders']
	
	return jsonify(folders), 200

def search(course_id, query):
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course does not exist')
	
	course_schema = CourseSchema()
	folders = course_schema.dump(course)['folders']
	
	results = []
	for folder in folders:
		for file in folder['files']:
			if query.lower() in file['name'].lower():
				results.append(file)
	
	return jsonify(results), 200

def get_file(file_id):
	file = File.query.get(file_id)
	if not file:
		raise NotFound('File does not exist')	
	return send_file(file.file_path, as_attachment=True), 200
