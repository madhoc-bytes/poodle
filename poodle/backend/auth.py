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
		is_teacher=is_teacher
	)
	
	db.session.add(new_user)

	user = User.query.filter_by(email=email).first()

	accessories=['nothing', 'prescription02'],
	clothesColor=['262e33', '5199e4', '929598', 'ffffff'],
	clothing=['blazerAndShirt', 'graphicShirt', 'shirtCrewNeck', 'shirtVNeck'],
	facialHair=['nothing', 'beardMajestic'],
	facialHairColor=['724133', 'a55728'],
	hairColor=['4a312c', 'a55728'],
	skinColor=['614335', 'd08b5b', 'edb98a', 'f8d25c', 'ffdbb4'],
	top=['bigHair', 'bob', 'curly', 'dreads01', 'shortCurly', 'shortRound',\
		'straight02', 'winterHat02', 'winterHat04'],

	new_avatar = Avatar(
		user_id=user.id,
		url='https://api.dicebear.com/6.x/avataaars/svg?seed=Cookie&accessories[]&accessoriesColor=262e33&accessoriesProbability=100&clothesColor=262e33&clothing=shirtCrewNeck&clothingGraphic=bat&eyebrows=default&eyes=default&facialHair[]&facialHairColor=2c1b18&facialHairProbability=100&hairColor=2c1b18&hatColor=929598&mouth=default&skinColor=d08b5b&top=shortRound',
		accessoriesStyle='nothing',
		clothesColorStyle='262e33',
		clothingStyle='shirtCrewNeck',
		facialHairStyle='nothing',
		facialHairColorStyle='724133',
		hairColorStyle='4a312c',
		skinColorStyle='d08b5b',
		topStyle='shortRound',

		accessories=pickle.dumps(accessories),
		clothesColor=pickle.dumps(clothesColor),
		clothing=pickle.dumps(clothing),
		facialHair=pickle.dumps(facialHair),
		facialHairColor=pickle.dumps(facialHairColor),
		hairColor=pickle.dumps(hairColor),
		skinColor=pickle.dumps(skinColor),
		top=pickle.dumps(top)
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
