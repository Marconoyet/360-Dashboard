import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManageBlogs.module.css";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "../Navbar/Navbar";
import { FaBook } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ManageBlogs = ({ editableJson, setEditableJson }) => {
  const navigate = useNavigate();
  const blogsData = editableJson?.blog?.blogs || [];
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.container}>
      {/* ✅ Styled Header at the Top */}
      <div className={styles.header}>
        <Navbar title={t("buttons.manageBlogs")} back>
          <button
            className={styles.addButton}
            onClick={() => navigate("/blog/new")}
          >
            <FaBook /> {t("buttons.addNewBlog")}
          </button>
        </Navbar>
      </div>

      {/* ✅ Blog Cards Grid Layout */}
      <div className={styles.blogList}>
        {blogsData.length > 0 ? (
          blogsData.map((blog, index) => (
            <div
              key={index}
              className={styles.blogCard}
              onClick={() => navigate(`/blog/edit/${index}`)}
            >
              {/* ✅ Slug Tag at the Top Left */}
              <div className={styles.slugTag}>{blog.slug}</div>

              {/* ✅ Blog Image */}
              <img
                className={styles.blogImage}
                src={blog.image}
                alt={blog.title}
              />

              <div className={styles.blogContent}>
                <h2>{blog.title}</h2>
                <p className={styles.meta}>{blog.meta_description}</p>
                <p className={styles.author}>
                  By <strong>{blog.author}</strong> • {blog.date}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageBlogs;
