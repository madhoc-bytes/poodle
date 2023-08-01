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
	prev = badge.efficient
	badge.efficient += efficient
	curr = badge.efficient
	check_tallies(user_id, prev, curr)

	prev = badge.academic
	badge.academic += academic
	curr = badge.academic
	check_tallies(user_id, prev, curr)

	prev = badge.helpful
	badge.helpful += helpful
	curr = badge.helpful
	check_tallies(user_id, prev, curr)

	db.session.commit()

	return jsonify({'message' : 'Tallies updated successfully'}), 200

# Check if the tally count reaches 10/20/30, then give the user the corresponding stars
def check_tallies(user_id, prev, curr):
	user = User.query.get(user_id)

	if not user:
		raise NotFound('Users not found')

	# Give the user 1 star
	if (prev < 10 <= curr):
		user.stars += 1
	# Give the user 2 stars
	elif (prev < 20 <= curr):
		user.stars += 2
	# Give the user 3 stars
	elif (prev < 30 <= curr):
		user.stars += 3

	db.session.commit()

	return 0
