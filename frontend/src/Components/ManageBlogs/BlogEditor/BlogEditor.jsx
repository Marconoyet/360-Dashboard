import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Editor } from "@tinymce/tinymce-react";
import styles from "./BlogEditor.module.css";
import Navbar from "../../Navbar/Navbar";
import { IoSave } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { modules } from "../../../Config/quillSetup";

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, false] }],
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image", "video"],
  ["clean"],
];

const BlogEditor = ({ editableJson, setEditableJson }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const { blogIndex } = useParams();
  const isEditing = blogIndex !== undefined;
  const blogsData = editableJson?.blog?.blogs || [];

  // ✅ Default Blog Structure
  const defaultBlog = {
    title: "",
    slug: "",
    image: "",
    meta_description: "",
    content: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
  };

  const modules = {
    toolbar: toolbarOptions,
    clipboard: { matchVisual: false },
  };

  // ✅ Ensure `blogIndex` is valid
  const index = parseInt(blogIndex, 10);
  const [blog, setBlog] = useState(
    isEditing && !isNaN(index) && blogsData[index]
      ? blogsData[index]
      : defaultBlog
  );

  // ✅ Handle Input Change
  const handleChange = (key, value) => {
    setBlog((prev) => {
      const updatedBlog = { ...prev, [key]: value };

      if (isEditing) {
        setEditableJson((prevJson) => {
          const updatedBlogs = blogsData.map((b, i) =>
            i === index ? updatedBlog : b
          );

          return {
            ...prevJson,
            blog: {
              ...prevJson.blog,
              blogs: [...updatedBlogs],
            },
          };
        });
      }

      return updatedBlog; // ✅ Always return a value (Prevents crash)
    });
  };

  const handleSave = () => {
    const updatedBlogs = isEditing
      ? blogsData.map((b, i) => (i === index ? blog : b))
      : [...blogsData, blog];

    setEditableJson((prevJson) => ({
      ...prevJson,
      blog: {
        ...prevJson.blog,
        blogs: [...updatedBlogs], // ✅ Ensure a new array reference
      },
    }));
    navigate("/manage-blogs");
  };

  // ✅ Delete Blog
  const handleDelete = () => {
    const updatedBlogs = blogsData.filter((_, i) => i !== index);
    setEditableJson((prevJson) => ({
      ...prevJson,
      blog: {
        ...prevJson.blog,
        blogs: [...updatedBlogs], // ✅ Ensure correct data structure
      },
    }));
    navigate("/manage-blogs");
  };

  return (
    <div className={styles.container}>
      <Navbar
        title={isEditing ? "Edit Blog" : "Create New Blog"}
        back
        backUrl="/manage-blogs"
      >
        <button className={styles.saveButton} onClick={handleSave}>
          <IoSave /> {t("buttons.saveBlog")}
        </button>
        {isEditing && (
          <button className={styles.deleteButton} onClick={handleDelete}>
            <MdDelete /> {t("buttons.deleteBlog")}
          </button>
        )}
      </Navbar>

      {/* ✅ Dynamically Render Input Fields */}
      {blog &&
        Object.entries(blog).map(([key, value]) =>
          key !== "content" ? (
            <div key={key} className={styles.inputGroup}>
              <label className={styles.label}>
                {key.replace(/_/g, " ").toUpperCase()}
              </label>
              <input
                type={key === "date" ? "date" : "text"}
                className={styles.input}
                value={value || ""}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ) : null
        )}

      {/* ✅ ReactQuill Editor for Content */}
      {blog && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Content</label>
          <Editor
            apiKey="cgxo4z9qdb739mew9a2g10ctvohe49ilf2ta227ty9br3qpq" // You can leave it blank in dev
            value={blog.content || ""}
            init={{
              height: 400,
              menubar: true,
              selector: "textarea",
              directionality: isRTL ? "rtl" : "ltr",
              language: isRTL ? "ar" : "en",
              plugins: [
                "autoresize",
                "advlist autolink lists link image charmap preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | table | removeformat | help |",
            }}
            onEditorChange={(content) => handleChange("content", content)}
          />
          {/* <ReactQuill
            theme="snow"
            value={blog.content || ""}
            onChange={(value) => handleChange("content", value)}
            modules={modules}
          /> */}
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
