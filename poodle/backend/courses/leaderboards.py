from flask import jsonify
from models import *
from werkzeug.exceptions import NotFound
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound
from statistics import median, mean

# retrieve leaderboards for quizzes and assignments for a course
def retrieve(user_id, course_id):
    user = User.query.get(user_id)
    if not user:
        raise NotFound('User not found')

    course = Course.query.get(course_id)
    if not course:
        raise NotFound('Course not found')
    
    res = []
    
    # get all quizzes for the course
    quizzes = Quiz.query.filter_by(course_id=course_id).all()
    for quiz in quizzes:
        quiz_id = quiz.id
        quiz_name = quiz.name
        
        # get all the students' marks for the quiz
        students_ranked = []
        quiz_marks = QuizScore.query.filter_by(quiz_id=quiz_id).order_by(QuizScore.score.desc()).all()
        for quiz_mark in quiz_marks:
            student_id = quiz_mark.user_id
            student = User.query.get(student_id)
            first_name = student.first_name
            last_name = student.last_name
            mark = quiz_mark.score
            students_ranked.append({'first_name': first_name, 'last_name': last_name, 'id': student_id, 'mark': mark})       

        # get mean and median for quiz
        quiz_median = get_median(students_ranked)
        quiz_mean = get_mean(students_ranked)        

        if user.is_teacher:
            curr_student_info = None
        else:
            rank = get_student_rank(students_ranked, user_id)    
            curr_student_info = {
                'rank': rank, 
                'id': user_id, 
                'first_name': first_name,
                'last_name': last_name
            }

        res.append(
            {
                'name': quiz_name, 
                'median': quiz_median, 
                'mean': quiz_mean, 
                'curr_student': curr_student_info, 
                'top_ten': students_ranked[:10]
            }
        )

def get_median(students_ranked):
    marks = []
    # get the median
    for student in students_ranked:
        student['mark'] = int(student['mark'])
        marks.append(student['mark'])
    return median(marks)

def get_mean(students_ranked):
    marks = []
    # get the median
    for student in students_ranked:
        student['mark'] = int(student['mark'])
        marks.append(student['mark'])
    return mean(marks)

def get_student_rank(students_ranked, user_id):
    rank = 0
    for student in students_ranked:
        rank += 1
        if student['id'] == user_id:
            return rank
    return -1