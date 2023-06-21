from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
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

user_schema = UserSchema()

with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']

    if User.query.filter_by(email=email).first():
        return jsonify(message='Email already exists'), 409

    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user)


@app.route('/api/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if not user or user.password != password:
        return jsonify(message='Invalid email or password'), 401

    # Perform additional login actions if needed

    return jsonify(message='Login successful')


if __name__ == '__main__':
    app.run(debug=True)