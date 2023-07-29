from flask import jsonify
from models import *
from werkzeug.exceptions import NotFound
from datetime import datetime

# retrieve upcoming quizzes and assignments for a student
def retrieve(student_id):
    student = User.query.get(student_id)
    if not student:
        raise NotFound('Student not found')
    res = []

    enrolments = Enrolment.query.filter_by(user_id=student_id).all()

    for enrolment in enrolments:
        course = Course.query.get(enrolment.course_id)
        for assignment in course.assignments:
            if assignment.due_date > datetime.now():
                res.append({'title': assignment.title, 'type': 'Assignments', 'course_id': course.id, 'course_name': course.name, 'due_date': assignment.due_date})
        for quiz in course.quizzes:
            if quiz.due_date > datetime.now():
                res.append({'title': quiz.name, 'type': 'Quizzes', 'course_id': course.id, 'course_name': course.name, 'due_date': quiz.due_date})
    
    sorted_list = sorted(res, key=lambda x: x['due_date'])
    return jsonify(sorted_list), 200
