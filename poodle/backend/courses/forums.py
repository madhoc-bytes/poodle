from flask import jsonify, send_file
from models import User, Course, CourseSchema, File, Folder, FolderSchema, Enrolment, ForumPost, ForumPostSchema, ForumReply, ForumReplySchema, db 
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
		if course.creator != user_id:
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

	if not forum_post:
		raise NotFound('Post not found')

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

def reply(user_id, forum_post_id, answer):
	
	forum_post = ForumPost.query.get(forum_post_id)
	if not forum_post:
		raise NotFound('Forum Post not found')

	course_id = forum_post.course_id
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	user = User.query.get(user_id)
	if not user:
		raise Unauthorized('User not found')
			
	if user.is_teacher:
		course = Course.query.get(course_id)
		if course.creator != user_id:
			raise Unauthorized('Permission denied: Unauthorised user')
	else:
		enrolment = Enrolment.query.filter_by(user_id=user_id, course_id = course_id).first()
		if not enrolment:
			raise Unauthorized('Permission denied: Unauthorised user')

	current_time = datetime.now()
	new_forum_reply = ForumReply(forum_post_id=forum_post_id, author_id=user_id, answer=answer, date_posted=current_time)
	db.session.add(new_forum_reply)
	db.session.commit()
	
	return jsonify({'message': 'Forum reply successfully made', 'forum_reply_id': new_forum_reply.id}), 200

def get_posts(user_id, course_id, category, phrase):

	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	
	user = User.query.get(user_id)
	if not user:
		raise Unauthorized('User not found')
			
	if user.is_teacher:
		course = Course.query.get(course_id)
		if course.creator != user_id:
			raise Unauthorized('Permission denied: Unauthorised user')
	else:
		enrolment = Enrolment.query.filter_by(user_id=user_id, course_id = course_id).first()
		if not enrolment:
			raise Unauthorized('Permission denied: Unauthorised user')
	
	#TODO: Check if phrase is empty/null (if so, return all results under category and course_id)
	#TODO: If category = 'all', return everything, otherwise filter on category 
	
	results = []
	forum_posts = ForumPost.query.filter_by(course_id = course_id).all()
	
	for forum_post in forum_posts:
		author = User.query.get(forum_post.author_id)

		results.append({
			"title": forum_post.title,
			"post_id": forum_post.id,
			"category": forum_post.category,
			"first_name": author.first_name,
			"last_name": author.last_name,
			"date_posted": forum_post.date_posted,
			"num_replies": len(ForumReply.query.filter_by(forum_post_id = forum_post.id).all())
		})
	# Filter on category
	if category != 'All':
		results = list(filter(lambda x: x["category"] == category, results))

	# Filter on phrase
	if phrase != None:
		results = list(filter(lambda x: phrase.lower() in x["title"].lower(), results))	

	sorted_results = sorted(results, key=lambda x: x["date_posted"], reverse=True)
	return jsonify(sorted_results), 200

def get_post_replies(user_id, course_id, post_id):

	# Check course, user and post exists
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')
	user = User.query.get(user_id)
	if not user:
		raise Unauthorized('User not found')
	forum_post = ForumPost.query.get(post_id)
	if not forum_post:
		raise NotFound('Post not found')
	
	# Check user is enrolled in course
	if user.is_teacher:
		course = Course.query.get(course_id)
		if course.creator != user_id:
			raise Unauthorized('Permission denied: Unauthorised user')
	else:
		enrolment = Enrolment.query.filter_by(user_id=user_id, course_id = course_id).first()
		if not enrolment:
			raise Unauthorized('Permission denied: Unauthorised user')
		
	# Get replies
	replies = ForumReply.query.filter_by(forum_post_id = post_id).all()
	answers = [] # store replies in list
	for reply in replies:
		author = User.query.get(reply.author_id)
		answers.append({
			"answer": reply.answer,
			"date_posted": reply.date_posted,
			"first_name": author.first_name,
			"last_name": author.last_name,
			"author_id": reply.author_id,
		})

	sorted_answers = sorted(answers, key=lambda x: x["date_posted"], reverse=True)
	
	author = User.query.get(forum_post.author_id)
	result = {
		"post_id": post_id,
		"title": forum_post.title,
		"category": forum_post.category,
		"author_id": forum_post.author_id,
		"first_name": author.first_name,
		"last_name": author.last_name,
		"file_id": forum_post.file_id,
		"date_posted": forum_post.date_posted,
		"description": forum_post.description,
		"replies": sorted_answers
	}

	return jsonify(result), 200

