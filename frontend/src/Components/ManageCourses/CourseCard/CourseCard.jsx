import React from "react";
import styles from "./CourseCard.module.css";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} />
      ))}
      {halfStar && <FaStarHalfAlt />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} />
      ))}
    </>
  );
};

const CourseCard = ({ course, instructors }) => {
  const navigate = useNavigate();
  console.log(instructors);
  // Map instructor IDs to full instructor objects
  const courseInstructors = (course.instructors || [])
    .map((id) => instructors.find((inst) => Number(inst.id) === Number(id)))
    .filter(Boolean); // remove nulls

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/course/edit/${course.id}`)}
    >
      <img src={course.image} alt={course.name} className={styles.image} />

      <div className={styles.content}>
        <span className={styles.category}>{course.category}</span>
        <div className={styles.footer}>
          <span className={styles.rating}>{renderStars(course.rating)}</span>
          <span className={styles.date}>{course.createdAt}</span>
        </div>
        <h3 className={styles.title}>{course.name}</h3>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.instructors}>
          {courseInstructors.map((inst) => (
            <a
              key={inst.id}
              href={inst.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // ✅ Prevent parent click
            >
              <img
                src={inst.image}
                alt={inst.name}
                className={styles.instructorImage}
                title={inst.name}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
