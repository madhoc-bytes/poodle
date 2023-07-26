from flask import jsonify
from models import *
from werkzeug.exceptions import NotFound
from datetime import datetime

def get_is_user_teacher(user_id):
    user = User.query.get(user_id)
    return jsonify(user.is_teacher), 200
