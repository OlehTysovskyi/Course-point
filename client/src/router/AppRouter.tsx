import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/HomePage";
import StudentPage from "../pages/student/StudentPage";
import CourseViewPage from "../pages/student/CourseViewPage";
import TeacherPage from "../pages/teacher/TeacherPage";
import CourseEditorPage from "../pages/teacher/CourseEditorPage";
import LessonEditorPage from "../pages/teacher/lesson/LessonEditorPage";
import AdminPage from "../pages/admin/AdminPage";
import NotFoundPage from "../pages/NotFoundPage";
import { JSX } from "react";

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles?: ("student" | "teacher" | "admin")[];
}) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/view-course"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CourseViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/edit-course/new"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <CourseEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/edit-course/:courseId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <CourseEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/edit-lesson/new/:courseId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <LessonEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/edit-lesson/:lessonId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <LessonEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
