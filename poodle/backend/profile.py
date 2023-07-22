from flask import jsonify
from models import User, UserSchema, db
from werkzeug.exceptions import BadRequest, NotFound

def edit(user_id, first_name, last_name, password):
	user = User.query.get(user_id)

	if not user:
		raise NotFound('User not found')

	if first_name != "":
		user.first_name = first_name
	if last_name != "":
		user.last_name = last_name
	if password != "":
		user.password = password

	db.session.commit()

	return jsonify({'message': 'User updated successfully'}), 200

def get_stars(user_id):
	user = User.query.get(user_id)

	if not user:
		raise NotFound('User not found')
	
	return jsonify({'stars': user.stars}), 200

def add_star(user_id, stars):
	user = User.query.get(user_id)

	if not user:
		raise NotFound('User not found')
	
	if stars <= 0:
		raise BadRequest('Invalid number of stars')

	user.stars += stars
	db.session.commit()

	return jsonify({'message': 'Stars added successfully'}), 200

def get_info(user_id):
	user = User.query.get(user_id)

	if not user:
		raise NotFound('User not found')

	return UserSchema().jsonify(user), 200
