import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import styles from "./EditableJsonContext.module.css";
import loadinng from "../assets/loading.png";
// ✅ Create Context
export const EditableJsonContext = createContext();

// ✅ Context Provider
const EditableJsonProvider = ({ children }) => {
  const [editableJson, setEditableJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { i18n } = useTranslation();

  // ✅ Fetch JSON from Backend on App Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/download?lang=${i18n.language}`
        );
        setEditableJson(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className={styles.loading}>
        <img src={loadinng} className={styles.logo} />
        <span>Everything Is Set +Up For You...</span>
      </div>
    );
  }

  return (
    <EditableJsonContext.Provider
      value={{ editableJson, setEditableJson, loading, error }}
    >
      {children}
    </EditableJsonContext.Provider>
  );
};

export default EditableJsonProvider;
