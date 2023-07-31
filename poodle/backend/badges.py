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