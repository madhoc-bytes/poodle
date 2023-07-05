from flask import jsonify
from models import User, Course, Enrolment, Folder, OnlineClass, OnlineClassSchema, db 
from datetime import datetime, timedelta
from variables import secret_key
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound

# ONLINE CLASSES
#TODO: rn students can create classes
def create(course_id, class_name):
	course = Course.query.get(course_id)
	if not course:
		raise NotFound('Course not found')	
	new_class = OnlineClass(name=class_name, course_id=course_id)
	
	db.session.add(new_class)
	db.session.commit()

	return jsonify({'message': 'Class successfully created', 'class_id': new_class.id}), 200   

def getAll(course_id):
	# Check if the course exists
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'message': 'Course not found'}), 404

    # Retrieve the online classes for the given course
    online_classes = OnlineClass.query.filter_by(course_id=course_id).all()
    online_class_schema = OnlineClassSchema()
    return online_class_schema.jsonify(online_classes, many=True), 200