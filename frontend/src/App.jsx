import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarComponent from "./Components/SidebarComponent/SidebarComponent";
import i18n from "./Config/i18n";
import MainView from "./Components/MainView/MainView";
import { useTranslation } from "react-i18next";
import ManageBlogs from "./Components/ManageBlogs/ManageBlogs";
import BlogEditor from "./Components/ManageBlogs/BlogEditor/BlogEditor";
import EditableJsonProvider, {
  EditableJsonContext,
} from "./context/EditableJsonContext"; // ✅ Correct Import
import ManageCourses from "./Components/ManageCourses/ManageCourses";
import CourseEditor from "./Components/ManageCourses/CourseEditor/CourseEditor";
function App() {
  const [selectedPage, setSelectedPage] = useState("home");
  const lang = localStorage.getItem("i18nextLng") || "en";
  useEffect(() => {
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.className = lang === "ar" ? "lang-ar" : "lang-en";
  }, [lang]);
  return (
    <EditableJsonProvider>
      <Router>
        <EditableJsonContext.Consumer>
          {({ editableJson, setEditableJson, loading, error }) => (
            <div className="flex-view">
              <SidebarComponent
                setSelectedPage={setSelectedPage}
                selectedPage={selectedPage}
              />

              <Routes>
                {/* ✅ MainView handles all pages except manage-blogs */}
                <Route
                  path="/"
                  element={
                    <MainView
                      error={error}
                      loading={loading}
                      selectedPage={selectedPage}
                      editableJson={editableJson}
                      setEditableJson={setEditableJson}
                    />
                  }
                />

                {/* ✅ Manage Blogs Page */}
                <Route
                  path="/manage-blogs"
                  element={
                    <ManageBlogs
                      editableJson={editableJson}
                      setEditableJson={setEditableJson}
                    />
                  }
                />
                <Route
                  path="/manage-courses"
                  element={
                    <ManageCourses
                      editableJson={editableJson}
                      setEditableJson={setEditableJson}
                    />
                  }
                />
                <Route
                  path="/blog/new"
                  element={
                    <BlogEditor
                      editableJson={editableJson}
                      setEditableJson={setEditableJson}
                    />
                  }
                />
                <Route
                  path="/blog/edit/:blogIndex"
                  element={
                    <BlogEditor
                      editableJson={editableJson}
                      setEditableJson={setEditableJson}
                    />
                  }
                />
                <Route
                  path="/course/new"
                  element={
                    <CourseEditor
                      editableJson={editableJson}
                      setEditableJson={setEditableJson}
                    />
                  }
                />
                <Route
                  path="/course/edit/:id"
                  element={
                    <CourseEditor
                      editableJson={editableJson}
                      setEditableJson={setEditableJson}
                    />
                  }
                />
              </Routes>
            </div>
          )}
        </EditableJsonContext.Consumer>
      </Router>
    </EditableJsonProvider>
  );
}

export default App;
