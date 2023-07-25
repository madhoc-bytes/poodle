from flask import jsonify
from models import User, Avatar, AvatarSchema, db
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import json
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
		'd6b370'],
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
]


}


def get_avatar_url(user_id):
	user = User.query.get(user_id)

	if not user:
		raise NotFound('User not found')
	
	avatar = Avatar.query.get(user_id)

	return jsonify({'avatar_url': avatar.url}), 200

def get_avatar_preview(user_id, attributes):
	user = User.query.get(user_id)
	avatar = Avatar.query.get(user_id)
	
	if not user:
		raise NotFound('User not found')
	
	atts = attributes.keys()

	curr_atts = {
	'accessories': avatar.accessoriesStyle,
	'clothesColor' : avatar.clothesColorStyle,
	'clothing' : avatar.clothingStyle,
	'facialHair' : avatar.facialHairStyle,
	'facialHairColor' : avatar.facialHairColorStyle,
	'hairColor' : avatar.hairColorStyle,
	'skinColor' : avatar.skinColorStyle,
	'top' : avatar.topStyle
	}
	print(attributes)
	for att in atts:
		curr_atts[att] = attributes[att]

	copy = curr_atts
	for key, items in copy.items():
		if items == 'nothing':
			curr_atts[key] = '[]'
		else:
			curr_atts[key] = '=' + items


	url = "https://api.dicebear.com/6.x/avataaars/svg?seed=Cookie"\
		f"&accessories{curr_atts['accessories']}"\
		f"&accessoriesColor=262e33"\
		f"&accessoriesProbability=100"\
		f"&clothesColor{curr_atts['clothesColor']}"\
		f"&clothing{curr_atts['clothing']}"\
		f"&clothingGraphic=bat"\
		f"&eyebrows=default"\
		f"&eyes=default"\
		f"&facialHair{curr_atts['facialHair']}"\
		f"&facialHairColor{curr_atts['facialHairColor']}"\
		f"&facialHairProbability=100"\
		f"&hairColor{curr_atts['hairColor']}"\
		f"&hatColor=929598"\
		f"&mouth=default"\
		f"&skinColor{curr_atts['skinColor']}"\
		f"&top{curr_atts['top']}"

	
	return jsonify({'preview': url, 'current': curr_atts}), 200

def unlock_attribute(user_id, attribute, style):
	user = User.query.get(user_id)
	avatar = Avatar.query.get(user_id)

	if not user:
		raise NotFound('User not found')
	
	if user.stars < 1:
		raise BadRequest('Not enough stars')
	
	if attribute not in total_attributes.keys():
		raise BadRequest('Invalid attribute')

	if style not in total_attributes[attribute]:
		raise BadRequest('Invalid style')
	
	curr_att_list = pickle.loads(avatar.__dict__[attribute])[0]
	
	if style in curr_att_list:
		raise BadRequest('Style already unlocked')
	
	avatar.__dict__[attribute + 'Style'] = style
	
	curr_att_list.append(style)

	avatar.__dict__[attribute] = pickle.dumps((curr_att_list,))
	user.stars -= 1

	new_avatar = Avatar(		
		user_id = avatar.user_id,
		url = avatar.url,
		accessories = avatar.accessories,
		clothesColor = avatar.clothesColor,
		clothing = avatar.clothing,
		facialHair = avatar.facialHair,
		facialHairColor = avatar.facialHairColor,
		hairColor = avatar.hairColor,
		skinColor = avatar.skinColor,
		top = avatar.top,
		accessoriesStyle = avatar.accessoriesStyle,
		clothesColorStyle = avatar.clothesColorStyle,
		clothingStyle = avatar.clothingStyle,
		facialHairStyle = avatar.facialHairStyle,
		facialHairColorStyle = avatar.facialHairColorStyle,
		hairColorStyle = avatar.hairColorStyle,
		skinColorStyle = avatar.skinColorStyle,
		topStyle = avatar.topStyle
	)
	db.session.delete(avatar)
	db.session.add(new_avatar)
	db.session.commit()

	return jsonify({'message': 'Attribute unlocked successfully'}), 200

def update_avatar(user_id, att_json):
	user = User.query.get(user_id)
	avatar = Avatar.query.get(user_id)

	if not user:
		raise NotFound('User not found')
	
	atts = att_json.keys()

	for att in atts:
		if att not in total_attributes.keys():
			raise BadRequest('Invalid attribute')
		if att_json[att] not in total_attributes[att]:
			raise BadRequest('Invalid style')
		if att_json[att] not in pickle.loads(avatar.__dict__[att])[0]:
			raise BadRequest('Style not unlocked')

	for att in atts:
		avatar.__dict__[att + 'Style'] = att_json[att]
		
	url = "https://api.dicebear.com/6.x/avataaars/svg?seed=Cookie"\
		f"&accessories{avatar.__dict__['accessoriesStyle']}"\
		f"&accessoriesColor=262e33"\
		f"&accessoriesProbability=100"\
		f"&clothesColor{avatar.__dict__['clothesColorStyle']}"\
		f"&clothing{avatar.__dict__['clothingStyle']}"\
		f"&clothingGraphic=bat"\
		f"&eyebrows=default"\
		f"&eyes=default"\
		f"&facialHair{avatar.__dict__['facialHairStyle']}"\
		f"&facialHairColor{avatar.__dict__['facialHairColorStyle']}"\
		f"&facialHairProbability=100"\
		f"&hairColor{avatar.__dict__['hairColorStyle']}"\
		f"&hatColor=929598"\
		f"&mouth=default"\
		f"&skinColor{avatar.__dict__['skinColorStyle']}"\
		f"&top{avatar.__dict__['topStyle']}"
	
	avatar.url = url
	db.session.commit()

	return jsonify({'message': 'Avatar updated successfully'}), 200

def get_attributes(user_id, attribute):
	user = User.query.get(user_id)
	avatar = Avatar.query.get(user_id)

	if not user:
		raise NotFound('User not found')
	
	if attribute not in total_attributes.keys():
		raise BadRequest('Invalid attribute')
	print(avatar.top)
	unlocked = pickle.loads(avatar.__dict__[attribute])[0]
	locked = list(set(total_attributes[attribute]).difference(unlocked))
	
	return jsonify({'unlocked': unlocked, 'locked' : locked}), 200

def get_avatar_by_user(user_id, target_id):
	user = User.query.get(user_id)

	if not user:
		raise NotFound('User not found')

	target = User.query.get(target_id)
	if not target:
		raise NotFound('Target not found')
	
	avatar = Avatar.query.get(target_id)

	return jsonify({'avatar_url': avatar.url}), 200
	