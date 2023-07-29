from flask import jsonify
from models import User, Avatar, AvatarSchema, db
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import pickle

total_attributes = {
    'accessories' : ['nothing',
		'eyepatch',
		'prescription02',
		'wayfarers'],
	'clothing' : ['blazerAndShirt',
		'graphicShirt',
		'hoodie',
		'overall',
		'shirtCrewNeck',
		'shirtVNeck'],
	'clothesColor' : ['262e33',
		'5199e4',
		'929598',
		'a7ffc4',
		'ff488e',
		'ffffb1'],
	'facialHair' : ['nothing',
		'beardMajestic',
		'moustacheFancy'],
	'facialHairColor' : ['724133',
		'a55728',
		'b58143',
		'c93305',
		'e8e1e1'],
	'hairColor': ['4a312c',
		'a55728',
		'c93305',
		'd6b370',
		'b58143'],
	'skinColor' : ['614335',
		'd08b5b',
		'edb98a',
		'f8d25c',
		'ffdbb4'],
	'top' : ['bigHair',
		'bob',
		'curly',
		'dreads01',
		'frida',
		'fro',
		'hat',
		'shortCurly',
		'shortRound',
		'sides',
		'straight02',
		'winterHat02',
		'winterHat04',
]}

def get_avatar_preview(user_id):
	user = User.query.get(user_id)
	
	if not user:
		raise NotFound('User not found')

	avatar = Avatar.query.get(user_id)
	
	curr_atts = avatar.curr_attributes

	return jsonify(curr_atts), 200

def unlock_attribute(user_id, attribute, style):
	user = User.query.get(user_id)
	avatar = Avatar.query.get(user_id)

	if not user:
		raise NotFound('User not found')
	
	if user.stars < 1:
		raise BadRequest('Not enough stars')
	
	if attribute not in total_attributes:
		raise BadRequest('Invalid attribute')

	if style not in total_attributes[attribute]:
		raise BadRequest('Invalid style')
	
	user_attributes = avatar.attributes
	
	if style in user_attributes[attribute]:
		raise BadRequest('Style already unlocked')

	user.stars -= 1
	user_attributes[attribute].append(style)
	# replace the old attributes with the new one
	avatar.attributes[attribute] = user_attributes[attribute]
 
	# avatar.attributes = user_attributes
	# print(user_attributes)
	db.session.commit()
	print(avatar.attributes)

	return jsonify({'message': (f"{attribute}:{style} unlocked successfully")}), 200

def update_avatar(user_id, att_json):
	user = User.query.get(user_id)
	avatar = Avatar.query.get(user_id)

	if not user:
		raise NotFound('User not found')
	
	for att, styles in att_json.items():
		if att not in total_attributes:
			continue
		for style in styles:
			if style not in total_attributes[att]:
				raise BadRequest('Invalid style')
			if style not in avatar.attributes[att]:
				raise BadRequest('Style locked')

	avatar.curr_attributes = att_json
	db.session.commit()
	return jsonify({'message': 'Avatar updated successfully'}), 200

def get_attributes(user_id):
	user = User.query.get(user_id)
	avatar = Avatar.query.get(user_id)

	if not user:
		raise NotFound('User not found')
	
	return jsonify(avatar.attributes), 200
	