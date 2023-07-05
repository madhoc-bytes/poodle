from flask import jsonify
from models import User, Course, Enrolment, Folder, db 
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
	
	date_created = datetime.today().date()

	new_folder = Folder(course_id=course_id, name=folder_name, date_created=date_created)
	course.folders.append(new_folder)

	db.session.add(new_folder)
	db.session.commit()

	return jsonify({'message': 'Folder successfully created', 'date_created': date_created}), 201
