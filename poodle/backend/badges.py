from flask import jsonify
from models import User, UserSchema, Badge, db
from werkzeug.exceptions import BadRequest, NotFound


def get_tallies(user_id):
	user = User.query.get(user_id)

	if not user:
		raise NotFound('Users not found')
	badge = Badge.query.get(user_id)

	tallies = {
		'efficient': badge.efficient,
		'academic': badge.academic,
		'helpful': badge.helpful
	}

	return jsonify({'message' : 'Tallies received successfully', 'tallies' : tallies}), 200

def get_badge_levels(user_id):
	user = User.query.get(user_id)

	if not user:
		raise NotFound('Users not found')
	badge = Badge.query.get(user_id)

	efficientLevel = 0
	academicLevel = 0
	helpfulLevel = 0

	if (badge.efficient >= 10):
		efficientLevel = 1
	if (badge.efficient >= 20):
		efficientLevel = 2
	if (badge.efficient >= 30):
		efficientLevel = 3
	
	if (badge.academic >= 10):
		academicLevel = 1
	if (badge.academic >= 20):
		academicLevel = 2
	if (badge.academic >= 30):
		academicLevel = 3

	if (badge.helpful >= 10):
		helpfulLevel = 1
	if (badge.helpful >= 20):
		helpfulLevel = 2
	if (badge.helpful >= 30):
		helpfulLevel = 3

	levels = {
		'efficient': efficientLevel,
		'academic': academicLevel,
		'helpful': helpfulLevel
	}

	return jsonify({'message' : 'Badge levels received successfully', 'levels' : levels}), 200

def update_tallies(user_id, efficient, academic, helpful):
	user = User.query.get(user_id)

	if not user:
		raise NotFound('Users not found')
	
	badge = Badge.query.get(user_id)

	badge.efficient += efficient
	badge.academic += academic
	badge.helpful += helpful

	db.session.commit()

	return jsonify({'message' : 'Tallies updated successfully'}), 200