from flask import jsonify, send_file
from models import User, Course, CourseSchema, File, Folder, FolderSchema, Enrolment, db 
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import os


def create(user_id, course_id, title, category, description):

	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')	
	
	user = User.query.get(user_id)
	if not user:
		raise Unauthorized('User not found')
	
	if user.is_teacher:
		course = Course.query.get(course_id)
		if course.creator not user_id:
			raise Unauthorized('Permission denied: Unauthorised user')
	else:
		enrolment = Enrolment.query.filter_by(user_id=user_id, course_id = course_id).first()
		if not enrolment:
			raise Unauthorized('Permission denied: Unauthorised user')

	date_posted = datetime.now()

	new_forum_post = ForumPost(course_id = course_id, title = title, category = category, author_id = user_id, description = description, date_posted = date_posted)

	db.session.add(new_forum_post)
	db.session.commit()

	return jsonify({'message': 'Forum post successfully created', 'post_id': new_forum_post.id}), 200


def upload_multimedia(user_id, post_id, attachment):

	forum_post = ForumPost.query.get(post_id)

	current_time = datetime.now()
	file = File(folder_id=0, name=attachment.filename, date_created=current_time, file_path='')
	db.session.add(file)
	db.session.commit()

	# save locally to fsh content	
	unique_name = str(file.id)
	destination = os.path.join(os.getcwd(), 'fsh', unique_name)
	attachment.save(destination)

	file.file_path = destination

	forum_post.file_id = file.id

	db.session.commit()
	return jsonify({'message': 'Multimedia successfully uploaded', 'file_id': file.id}), 201
	
