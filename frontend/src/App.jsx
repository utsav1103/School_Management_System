import { BrowserRouter, Route, Routes } from "react-router-dom";
import School from "./school/School.jsx";
import "./App.css";
import Attendance from "./school/components/attendance/Attendance.jsx";
import Dashboard from "./school/components/dashboard/Dashboard.jsx";
import Class from "./school/components/class/Class.jsx";
import Examinations from "./school/components/examinations/Examinations.jsx";
import Notice from "./school/components/notice/Notice.jsx";
import Schedule from "./school/components/schedule/Schedule.jsx";
import Students from "./school/components/students/Students.jsx";
import Subjects from "./school/components/subjects/Subjects.jsx";
import Teachers from "./school/components/teachers/Teachers.jsx";
import Client from "./client/Client.jsx";
import Home from "./client/components/home/Home.jsx";
import Login from "./client/components/login/Login.jsx";
import Register from "./client/components/register/Register.jsx";
import Teacher from "./teacher/Teacher.jsx";
import TeacherDetails from "./teacher/components/teacher details/TeacherDetails.jsx";
import ScheduleTeacher from "./teacher/components/schedule/ScheduleTeacher.jsx";
import AttendanceTeacher from "./teacher/components/attendance/AttendanceTeacher.jsx";
import ExaminationsTeacher from "./teacher/components/examinations/ExaminationsTeacher.jsx";
import NoticeTeacher from "./teacher/components/notice/NoticeTeacher.jsx";
import Student from "./student/Student.jsx";
import StudentDetails from "./student/components/student details/StudentDetails.jsx";
import ScheduleStudent from "./student/components/schedule/ScheduleStudent.jsx";
import AttendanceStudent from "./student/components/attendance/AttendanceStudent.jsx";
import ExaminationsStudent from "./student/components/examinations/ExaminationsStudent.jsx";
import NoticeStudent from "./student/components/notice/NoticeStudent.jsx";
import ProtectedRoute from "./assets/guard/ProtectedRoute.jsx";
import  {AuthProvider}  from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter> 
        <Routes>
          {/*School Routes*/}
          <Route path="school" element={<ProtectedRoute allowedRoles={['SCHOOL']}><School /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="class" element={<Class />} />

            <Route path="examinations" element={<Examinations />} />
            <Route path="notice" element={<Notice />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="students" element={<Students />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>

          {/*Student Routes*/}
          <Route path="student" element={<ProtectedRoute allowedRoles={['STUDENT']}><Student /></ProtectedRoute>}>

            <Route index element={<StudentDetails/>} />
            <Route path="schedule" element={<ScheduleStudent/>} />
            <Route path="attendance" element={<AttendanceStudent/>} />
            <Route path="examinations" element={<ExaminationsStudent/>} />
            <Route path="notice" element={<NoticeStudent/>} />


          </Route>

          {/*TEacher Routes*/}
          <Route path="teacher" element={<ProtectedRoute allowedRoles={['TEACHER']}><Teacher /></ProtectedRoute>}>

            <Route index element={<TeacherDetails/>} />
            <Route path="schedule" element={<ScheduleTeacher/>} />
            <Route path="attendance" element={<AttendanceTeacher/>} />
            <Route path="examinations" element={<ExaminationsTeacher/>} />
            <Route path="notice" element={<NoticeTeacher/>} />


          </Route>

          {/*Clients Routes*/}
          <Route
              path="/" element={<Client />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
