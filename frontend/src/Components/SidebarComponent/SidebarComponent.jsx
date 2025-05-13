import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  FaHome,
  FaBook,
  FaHandshake,
  FaInfoCircle,
  FaPhone,
  FaUsers,
  FaBlog,
  FaLanguage,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SidebarComponent.module.css";

const SidebarComponent = ({ setSelectedPage, selectedPage }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Toggle language between English and Arabic
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";

    i18n.changeLanguage(newLang).then(() => {
      document.dir = newLang === "ar" ? "rtl" : "ltr";
      document.documentElement.className =
        newLang === "ar" ? "lang-ar" : "lang-en";
      window.location.reload(); // Force reload to apply full language change
    });
  };

  // Function to handle navigation and active menu selection
  const handleNavigation = (path) => {
    setSelectedPage(path);
    // navigate(path);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} className={styles.sidebar}>
        <Menu iconShape="square" className={styles.menu}>
          <MenuItem
            onClick={() => handleNavigation("home")}
            icon={<FaHome className={styles.icon} />}
            className={`${styles.menuItem} ${
              selectedPage === "home" ? styles.active : ""
            }`}
          >
            {!collapsed && t("home")}
          </MenuItem>
          <MenuItem
            onClick={() => handleNavigation("courses")}
            icon={<FaBook className={styles.icon} />}
            className={`${styles.menuItem} ${
              selectedPage === "courses" ? styles.active : ""
            }`}
          >
            {!collapsed && t("courses")}
          </MenuItem>
          <MenuItem
            onClick={() => handleNavigation("partner")}
            icon={<FaHandshake className={styles.icon} />}
            className={`${styles.menuItem} ${
              selectedPage === "partner" ? styles.active : ""
            }`}
          >
            {!collapsed && t("partner")}
          </MenuItem>
          <MenuItem
            onClick={() => handleNavigation("about")}
            icon={<FaInfoCircle className={styles.icon} />}
            className={`${styles.menuItem} ${
              selectedPage === "about" ? styles.active : ""
            }`}
          >
            {!collapsed && t("about")}
          </MenuItem>
          <MenuItem
            onClick={() => handleNavigation("contact")}
            icon={<FaPhone className={styles.icon} />}
            className={`${styles.menuItem} ${
              selectedPage === "contact" ? styles.active : ""
            }`}
          >
            {!collapsed && t("contact")}
          </MenuItem>
          <MenuItem
            onClick={() => handleNavigation("teams")}
            icon={<FaUsers className={styles.icon} />}
            className={`${styles.menuItem} ${
              selectedPage === "teams" ? styles.active : ""
            }`}
          >
            {!collapsed && t("teams")}
          </MenuItem>
          <MenuItem
            onClick={() => handleNavigation("blog")}
            icon={<FaBlog className={styles.icon} />}
            className={`${styles.menuItem} ${
              selectedPage === "blog" ? styles.active : ""
            }`}
          >
            {!collapsed && t("blog")}
          </MenuItem>
          <MenuItem
            onClick={toggleLanguage}
            icon={<FaLanguage className={styles.icon} />}
            className={styles.menuItem}
          >
            {!collapsed && (i18n.language === "en" ? "العربية" : "English")}
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
