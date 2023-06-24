from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import datetime, timedelta
import jwt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.secret_key = '3d6f45a5fc12445dbac2f59c3b6c7cb1'
db = SQLAlchemy(app)
ma = Marshmallow(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    id = ma.auto_field()
    email = ma.auto_field()

with app.app_context():
    db.create_all()

user_schema = UserSchema()

@app.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']

    if User.query.filter_by(email=email).first():
        return jsonify(message='Email already exists'), 409

    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user)


@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if not user or user.password != password:
        return jsonify(message='Invalid email or password'), 401

    token = jwt.encode({'user_id': user.id, 'exp': datetime.utcnow() + timedelta(minutes=60)}, app.config['SECRET_KEY'])

    return jsonify({'message': 'Login successful', 'token': token, 'user_id': user.id}), 200


if __name__ == '__main__':
    app.run(debug=True)