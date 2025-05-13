// Components/ManageCourses/ManageCourses.jsx
import React from "react";
import CourseCard from "./CourseCard/CourseCard";
import styles from "./ManageCourses.module.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBook } from "react-icons/fa";

const ManageCourses = ({ editableJson, setEditableJson }) => {
  const coursesData = editableJson?.courses?.coursesData || [];
  const instructors = editableJson?.teams?.instructors || [];
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const handleEdit = (id) => {
    // Navigate or open modal to edit course with id
    console.log("Edit course:", id);
  };

  const handleDelete = (id) => {
    const updatedCourses = coursesData.filter((course) => course.id !== id);
    setEditableJson((prev) => ({
      ...prev,
      courses: {
        ...prev.courses,
        coursesData: updatedCourses,
      },
    }));
  };

  return (
    <div className={styles.container}>
      {/* ✅ Styled Header at the Top */}
      <div className={styles.header}>
        <Navbar title={t("buttons.manageCourses")} back>
          <button
            className={styles.addButton}
            onClick={() => navigate("/course/new")}
          >
            <FaBook /> {t("buttons.addNewCourse")}
          </button>
        </Navbar>
      </div>
      <div className={styles.grid}>
        {coursesData.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            instructors={instructors}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageCourses;
