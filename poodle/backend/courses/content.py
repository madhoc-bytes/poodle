from flask import jsonify
from models import User, Course, CourseSchema, File, Folder, FolderSchema, Enrolment, db 
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound

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

def create_file(file_name, user_id, folder_id, data):
	user = User.query.get(user_id)
	if not user.is_teacher:
		raise Unauthorized('User permission denied')
	
	folder = Folder.query.get(folder_id)
	if not folder:
		raise NotFound('Folder not found')	
	
	date_created = datetime.now()

	new_file = File(folder_id=folder_id, name=file_name, date_created=date_created, data=data)
	db.session.add(new_file)
	db.session.commit()

	return jsonify({'message': 'File uploaded successfully'}), 200

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

