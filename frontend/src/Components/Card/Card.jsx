import React from "react";
import styles from "./Card.module.css";
import EditableList from "../EditableList/EditableList";
import EditableObject from "../EditableObject/EditableObject";

const formatHeader = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const Card = ({ sectionKey, sectionData, onEdit }) => {
  return (
    <>
      {sectionKey != "blogs" && sectionKey != "coursesData" && (
        <div className={styles.card}>
          {<h2 className={styles.header}>{formatHeader(sectionKey)}</h2>}

          {Object.keys(sectionData).map((key) => {
            const value = sectionData[key];
            return typeof value === "string" ? ( // ✅ If it's a string, show input
              <div key={key} className={styles.inputGroup}>
                <label className={styles.label}>{formatHeader(key)}</label>
                <input
                  type="text"
                  className={styles.input}
                  value={value || ""}
                  onChange={(e) => onEdit(sectionKey, key, e.target.value)}
                />
              </div>
            ) : null;
          })}

          {/* ✅ Handle Lists */}
          {Object.entries(sectionData).map(([key, value]) =>
            Array.isArray(value) ? (
              <EditableList
                key={key}
                sectionKey={key}
                listData={value}
                onEdit={(updatedList) => onEdit(sectionKey, key, updatedList)}
              />
            ) : null
          )}

          {/* ✅ Handle Objects */}
          {Object.entries(sectionData).map(([key, value]) =>
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) ? (
              <EditableObject
                key={key}
                sectionKey={key}
                objectData={value}
                onEdit={(updatedObject) =>
                  onEdit(sectionKey, key, updatedObject)
                }
              />
            ) : null
          )}
        </div>
      )}
    </>
  );
};

export default Card;
