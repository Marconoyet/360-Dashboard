import React from "react";
import styles from "./EditableObject.module.css";

const EditableObject = ({ sectionKey, objectData, onEdit }) => {
  const handleChange = (key, value) => {
    const updatedObject = { ...objectData, [key]: value };
    onEdit(updatedObject);
  };

  return (
    <div className={styles.objectContainer}>
      {" "}
      <h3 className={styles.header}>
        {sectionKey.replace(/_/g, " ").toUpperCase()}
      </h3>
      <div className={styles.listItem}>
        {Object.entries(objectData).map(([key, value]) => (
          <div key={key} className={styles.inputGroup}>
            <label className={styles.label}>
              {key.replace(/_/g, " ").toUpperCase()}
            </label>
            <input
              type="text"
              className={styles.input}
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditableObject;
