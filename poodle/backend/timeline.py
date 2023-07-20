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
    for enrolment in student.enrolments:
        course = Course.query.get(enrolment.course_id)
        for assignment in course.assignments:
            if assignment.due_date > datetime.now():
                res.append({'title': assignment.title, 'type': 'Assignment', 'course_id': course.id, 'course_name': course.name, 'due_date': assignment.due_date})
        for quiz in course.quizzes:
            if quiz.due_date > datetime.now():
                res.append({'title': quiz.title, 'type': 'Quiz', 'course_id': course.id, 'course_name': course.name, 'due_date': quiz.due_date})
    return jsonify(res), 200
