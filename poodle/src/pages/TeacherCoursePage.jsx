import react from 'react';
import { useParams } from 'react-router-dom';
import CourseSidebar from '../components/CourseSidebar';
import NavBar from '../components/NavBar';

const TeacherCoursePage = () => {
    const courseId = useParams().courseId;
    const page = useParams().coursePage;
    return (
        <>
            <NavBar />
            <CourseSidebar />
            this is the teacher course page for {courseId}.
            We are on page {page}
        </>
    )
}

export default TeacherCoursePage;
