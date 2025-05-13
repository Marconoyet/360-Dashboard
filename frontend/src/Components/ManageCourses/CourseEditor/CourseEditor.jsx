import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./CourseEditor.module.css";
import Navbar from "../../Navbar/Navbar";
import { IoSave } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Card from "../../Card/Card";
const CourseEditor = ({ editableJson, setEditableJson }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== undefined;
  const coursesData = editableJson?.courses?.coursesData || [];
  const defaultCourse = {
    id: "",
    lms: "",
    name: "",
    category: "",
    description: "",
    rating: "",
    instructors: [],
    createdAt: new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    image: "",
    HeroSection: {
      seo_title: "",
      subtitle: "",
    },
    CourseOverview: {
      badge: "",
      seo_title: "",
      description: "",
      price: "",
      discount: "",
      features: [],
    },
    WhoShouldEnrollintheCIACourse: {
      badge: "",
      seo_title: "",
      subtitle: "",
      targeted_titles: [],
    },
    WhatWillYouLearncourseModules: {
      seo_title: "",
      subtitle: "",
      learn: [],
    },
    TestimonialsandReviews: {
      testimonials: "",
      seo_title: "",
      subtitle: "",
      sample_description: "",
      cta: "",
      target_keywords: "",
      instructions: "",
      reviews: [],
    },
    OurInstructorsSectionrepeated: {
      badge: "",
      seo_title: "",
      subtitle: "",
      target_keywords: "",
      cta: "",
      content_writer_instructions: "",
    },
    RelatedCoursesSection: {
      badge: "",
      seo_title: "",
      subtitle: "",
      cta: "",
      target_keywords: "",
      instructions: "",
    },
    FAQs: {
      seo_title: "",
      subtitle: "",
      faqs: [],
    },
    CalltoAction: {
      seo_title: "",
      sample_description: "",
      cta: "",
    },
    LatestArticlesSection: {
      seo_title: "",
      subtitle: "",
      sample_description: "",
      cta: "",
    },
  };

  // ✅ Ensure `id` is valid
  const [course, setCourse] = useState(() => {
    return isEditing
      ? coursesData.find((c) => c.id === id) || defaultCourse
      : defaultCourse;
  });

  const handleSave = () => {
    const updatedCourses = isEditing
      ? coursesData.map((c) => (c.id === id ? course : c))
      : [...coursesData, course];

    setEditableJson((prevJson) => ({
      ...prevJson,
      courses: {
        ...prevJson.courses,
        coursesData: updatedCourses,
      },
    }));

    navigate("/manage-courses");
  };

  const handleDelete = () => {
    const updatedCourses = coursesData.filter((course) => course.id !== id);

    setEditableJson((prevJson) => ({
      ...prevJson,
      courses: {
        ...prevJson.courses,
        coursesData: updatedCourses,
      },
    }));
    navigate("/manage-courses");
  };

  const onEdit = (sectionKey, fieldKey, newValue) => {
    setCourse((prev) => {
      const updatedCourse = {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [fieldKey]: newValue,
        },
      };

      if (isEditing) {
        setEditableJson((prevJson) => {
          const updatedCourses = prevJson.courses.coursesData.map((c) =>
            c.id === id ? updatedCourse : c
          );

          return {
            ...prevJson,
            courses: {
              ...prevJson.courses,
              coursesData: updatedCourses,
            },
          };
        });
      }

      return updatedCourse; // ✅ مهم جدًا عشان الـ UI يفضل يعرض القيمة الجديدة
    });
  };

  return (
    <div className={styles.container}>
      <Navbar
        title={isEditing ? "Edit Course" : "Create Course"}
        back
        backUrl="/manage-courses"
      >
        <button className={styles.saveButton} onClick={handleSave}>
          <IoSave /> {t("buttons.saveCourse")}
        </button>
        {isEditing && (
          <button className={styles.deleteButton} onClick={handleDelete}>
            <MdDelete /> {t("buttons.deleteCourse")}
          </button>
        )}
      </Navbar>

      {/* ✅ Dynamically Render Input Fields */}
      {course &&
        Object.entries(course).map(([key, value]) =>
          typeof value === "string" ? (
            <div key={key} className={styles.inputGroup}>
              <label className={styles.label}>
                {key.replace(/_/g, " ").toUpperCase()}
              </label>
              <input
                type="text"
                className={styles.input}
                value={value || ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCourse((prev) => {
                    const updatedCourse = { ...prev, [key]: newValue };
                    if (isEditing) {
                      setEditableJson((prevJson) => {
                        const courses = prevJson?.courses?.coursesData || [];
                        const updatedCourses = courses.map((c) =>
                          c.id === id ? updatedCourse : c
                        );
                        return {
                          ...prevJson,
                          courses: {
                            ...(prevJson.courses || {}),
                            coursesData: updatedCourses,
                          },
                        };
                      });
                    }
                    return updatedCourse;
                  });
                }}
              />
            </div>
          ) : null
        )}
      {/* ✅ Instructors Selection */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>INSTRUCTORS</label>
        <div className={styles.instructorGrid}>
          {editableJson?.teams?.instructors?.map((inst) => (
            <div
              key={inst.id}
              className={`${styles.instructorItem} ${
                course.instructors.includes(inst.id) ? styles.selected : ""
              }`}
              onClick={() => {
                const updated = course.instructors.includes(inst.id)
                  ? course.instructors.filter((id) => id !== inst.id)
                  : [...course.instructors, inst.id];

                setCourse((prev) => {
                  const updatedCourse = { ...prev, instructors: updated };
                  if (isEditing) {
                    setEditableJson((prevJson) => {
                      const updatedCourses = prevJson.courses.coursesData.map(
                        (c) => (c.id === id ? updatedCourse : c)
                      );
                      return {
                        ...prevJson,
                        courses: {
                          ...prevJson.courses,
                          coursesData: updatedCourses,
                        },
                      };
                    });
                  }
                  return updatedCourse;
                });
              }}
            >
              <img
                src={inst.image}
                alt={inst.name}
                className={styles.instructorImg}
              />
              <span className={styles.instructorName}>{inst.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.cardsContainer}>
        {Object.entries(course).map(([key, value]) =>
          typeof value === "object" &&
          value !== null &&
          key !== "instructors" ? (
            <Card
              key={key}
              sectionKey={key}
              sectionData={value}
              onEdit={onEdit}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default CourseEditor;
