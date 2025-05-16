import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/HomePage";
import StudentPage from "../pages/users/student/StudentPage";
import CourseViewPage from "../pages/content/course/CourseViewPage";
import TeacherPage from "../pages/users/teacher/TeacherPage";
import CourseCreatePage from "../pages/content/course/CourseCreatePage";
import CourseEditPage from "../pages/content/course/CourseEditPage";
import CoursesListPage from "../pages/content/course/CoursesListPage";
import LessonCreatePage from "../pages/content/lesson/LessonCreatePage";
import LessonEditPage from "../pages/content/lesson/LessonEditPage";
import LessonViewPage from "../pages/content/lesson/LessonViewPage";
import ModuleCreatePage from "../pages/content/module/ModuleCreatePage";
import ModuleEditPage from "../pages/content/module/ModuleEditPage";
import ModulePassPage from "../pages/content/module/ModulePassPage";
import AdminPage from "../pages/users/admin/AdminPage";
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
          path="/view-course/:courseId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CourseViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses-list"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CoursesListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-lesson/:lessonId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <LessonViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-module/:courseId/:moduleId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ModulePassPage />
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
          path="/teacher/create-course"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <CourseCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/edit-course/:courseId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <CourseEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/create-lesson/:courseId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <LessonCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/edit-lesson/:lessonId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <LessonEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/create-module/:courseId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <ModuleCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/edit-module/:moduleId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <ModuleEditPage />
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
