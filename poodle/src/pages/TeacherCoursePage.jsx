import react from 'react';
import { useParams } from 'react-router-dom';

const TeacherCoursePage = () => {
    const courseId = useParams().courseId;
    return (
        <>
            this is the teacher course page for {courseId}
        </>
    )
}

export default TeacherCoursePage;
