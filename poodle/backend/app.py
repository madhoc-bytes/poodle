from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import datetime, timedelta
import jwt
import auth

# init app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

# init db
from models import User, UserSchema, db, ma # DON'T move this line
db.init_app(app)
ma.init_app(app)
with app.app_context():
    db.create_all()

# app decorators
@app.route('/register', methods=['POST'])
def register():
    email,password = request.json['email'], request.json['password']
    return auth.register(email, password)

@app.route('/login', methods=['POST'])
def login():
    email,password = request.json['email'], request.json['password']
    return auth.login(email, password)

if __name__ == '__main__':
    app.run(debug=True)