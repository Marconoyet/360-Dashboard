import React, { useState, useEffect } from "react";
import styles from "./MainView.module.css";
import { useTranslation } from "react-i18next";
import Card from "../Card/Card";
import EditableList from "../EditableList/EditableList";
import { useNavigate } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
import Navbar from "../Navbar/Navbar";
const MainView = ({
  error,
  loading,
  selectedPage,
  editableJson,
  setEditableJson,
}) => {
  const { t, i18n } = useTranslation();

  const sectionData = editableJson?.[selectedPage];
  const navigate = useNavigate();
  // ✅ Fix: Properly Update JSON Structure
  const onEdit = (sectionKey, fieldKey, newValue) => {
    setEditableJson((prevJson) => ({
      ...prevJson,
      [selectedPage]: {
        ...prevJson[selectedPage],
        [sectionKey]: {
          ...prevJson[selectedPage][sectionKey],
          [fieldKey]: newValue, // ✅ Update the specific field
        },
      },
    }));
  };

  // ✅ Fix: Handle Saving JSON

  return (
    <div className={styles.container}>
      <Navbar
        title={selectedPage.toUpperCase()}
        selectedPage={selectedPage}
      ></Navbar>
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      {!loading && !error && sectionData ? (
        <div style={{ marginTop: "70px" }}>
          <div className={styles.simpleFields}>
            {Object.entries(sectionData).map(([key, value]) =>
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
                      setEditableJson((prevJson) => ({
                        ...prevJson,
                        [selectedPage]: {
                          ...prevJson[selectedPage],
                          [key]: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
              ) : null
            )}
          </div>

          <div className={styles.cardsContainer}>
            {Object.entries(sectionData).map(([key, value]) =>
              typeof value === "object" && value !== null ? (
                <Card
                  key={key}
                  sectionKey={key}
                  sectionData={value}
                  onEdit={onEdit}
                />
              ) : null
            )}
          </div>
          {selectedPage === "blog" && (
            <div className={styles.inputGroup}>
              <button
                className={styles.manageBlogsButton}
                onClick={() => navigate("/manage-blogs")}
              >
                <IoSettings size={22} /> {t("buttons.manageBlogs")}
              </button>
            </div>
          )}

          {selectedPage === "courses" && (
            <div className={styles.inputGroup}>
              <button
                className={styles.manageBlogsButton}
                onClick={() => navigate("/manage-courses")}
              >
                <IoSettings size={22} /> {t("buttons.manageCourses")}
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className={styles.error}>No data available for this section.</p>
      )}
    </div>
  );
};

export default MainView;
