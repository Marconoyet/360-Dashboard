import React, { useState, useContext } from "react";
import styles from "./Navbar.module.css";
import { MdCloudUpload } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { IoArrowForwardSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { EditableJsonContext } from "../../context/EditableJsonContext";
import { useTranslation } from "react-i18next";
import { uploadTranslation } from "../../utils/uploadTranslation";
const Navbar = ({ title, children, back, backUrl }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const { editableJson } = useContext(EditableJsonContext);
  const handleSaveLocal = () => {
    const jsonString = JSON.stringify(editableJson, null, 2); // Pretty-print JSON
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `edited.json`; // ✅ File name format: home_edited.json
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async () => {
    const result = await uploadTranslation(editableJson, i18n.language);
    if (result.success) {
      alert("✅ Translation uploaded successfully!");
    } else {
      alert("❌ Upload failed: " + result.error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        {back && (
          <button onClick={() => navigate(backUrl ? backUrl : "/")}>
            {isRTL ? <IoArrowForwardSharp /> : <IoArrowBack />}
          </button>
        )}
        <h1 className={styles.navTitle}>{title}</h1>
      </div>
      <div className={styles.navRight}>
        <button className={styles.saveButton} onClick={handleSave}>
          <MdCloudUpload /> {t("buttons.saveToServer")}
        </button>
        {children}
      </div>
    </nav>
  );
};

export default Navbar;
