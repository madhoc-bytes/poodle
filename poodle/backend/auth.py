from flask import jsonify
from models import User, UserSchema, Avatar, Badge, db
from datetime import datetime, timedelta
from secrets import token_urlsafe
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
import jwt
import pickle

user_schema = UserSchema()
users_schema = UserSchema(many=True)

def register(email, password, first_name, last_name, is_teacher):
	if User.query.filter_by(email=email).first():
		raise BadRequest('Email already exists')
	
	new_user = User(
		first_name=first_name, 
		last_name=last_name, 
		email=email, 
		password=password,
		is_teacher=is_teacher,
		stars=0
	)
	
	db.session.add(new_user)
	user = User.query.filter_by(email=email).first()
 
	attributes = {'accessories': ['nothing', 'prescription02'],
               'clothesColor': ['262e33', '5199e4', '929598', 'ffffff' ],
               'clothing': ['blazerAndShirt', 'graphicShirt', 'shirtCrewNeck', 'shirtVNeck'],
               'facialHair': ['nothing', 'beardMajestic'],
               'facialHairColor': ['724133', 'a55728'],
               'hairColor': ['4a312c', 'a55728'],
               'skinColor': ['614335', 'd08b5b', 'edb98a', 'f8d25c', 'ffdbb4'],
               'top': ['bigHair', 'bob', 'curly', 'dreads01', 'shortCurly',\
                   'shortRound', 'straight02', 'winterHat02', 'winterHat04']
               }
 
	teacher_attributes = {
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
 
	curr_attributes = {'seed': 'Cookie',
                    'accessories': [],
                    'accessoriesProbability': 100,
                    'clothesColor': ["262e33"],
                    'clothing': ["shirtCrewNeck"],
                    'eyebrows': ["default"],
                    'eyes': ["default"],
      				'facialHair': [],
      				'facialHairColor': ["724133"],
            		'facialHairProbability': 100,
      				'hairColor': ["4a312c"],
      				'hatColor': ["transparent"],
            		'mouth': ["default"],
      				'skinColor': ["d08b5b"],
      				'top': ["shortRound"]
          }
 
	new_avatar = None
 
	if is_teacher:
		new_avatar = Avatar(
		user_id=user.id,
  		attributes=teacher_attributes,
  		curr_attributes=curr_attributes
		)
	else:
		new_avatar = Avatar(
			user_id=user.id,
			attributes=attributes,
			curr_attributes=curr_attributes
		)

	db.session.add(new_avatar)

	new_badges = Badge(user_id=user.id)

	db.session.add(new_badges)
	db.session.commit()
	return user_schema.jsonify(new_user), 200

def login(email, password):
	user = User.query.filter_by(email=email).first()

	if not user or user.password != password:
		raise Unauthorized('Invalid email or password')

	payload = {
		'user_id': user.id,
		'exp': datetime.utcnow() + timedelta(minutes=300)
	}

	token = jwt.encode(payload, secret_key, algorithm='HS256')

	return jsonify({'message': 'Login successful', 'token': token, 'user_id': user.id, 'is_teacher': user.is_teacher}), 200

def logout(token):
	if not token:
		raise Unauthorized('Authorization token missing')
	return jsonify({'message': 'Logout successful'}), 200
