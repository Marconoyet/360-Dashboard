import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaTrash } from "react-icons/fa";
import styles from "./SortableItem.module.css";
import { IoMoveOutline } from "react-icons/io5";

const SortableItem = ({
  id,
  item,
  index,
  isSimpleList,
  onChange,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Get sortable properties
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      // disabled: isEditing, // ✅ Disable drag while editing input
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // ✅ Keep track of input focus dynamically
  const inputRefs = useRef({});

  useEffect(() => {
    Object.keys(item).forEach((key) => {
      if (
        inputRefs.current[key] &&
        document.activeElement === inputRefs.current[key]
      ) {
        inputRefs.current[key].focus();
      }
    });
  }, [item]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={styles.listItem}
    >
      <div className={styles.inputs}>
        {isSimpleList ? (
          // ✅ Bullet List (Simple List of Strings)
          <input
            ref={(el) => (inputRefs.current["text"] = el)}
            type="text"
            className={styles.input}
            value={item.text || ""}
            onChange={(e) => onChange(index, "text", e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
          />
        ) : (
          // ✅ Object List (Multiple Fields)
          Object.keys(item).map((key) =>
            key !== "id" ? (
              <div key={key} className={styles.inputGroup}>
                <label className={styles.label}>
                  {key.replace(/_/g, " ").toUpperCase()}
                </label>
                <input
                  ref={(el) => (inputRefs.current[key] = el)}
                  type="text"
                  className={styles.input}
                  value={item[key] || ""} // ✅ Ensure default value is an empty string
                  onChange={(e) => onChange(index, key, e.target.value)}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                />
              </div>
            ) : null
          )
        )}
      </div>
      <div className={styles.controllers}>
        <div
          className={styles.deleteIcon}
          onClick={(e) => {
            e.stopPropagation(); // ✅ Prevent drag from interfering
            onDelete(index);
          }}
        >
          <FaTrash />
        </div>
        <div {...listeners} className={styles.dragHandle}>
          <IoMoveOutline />
        </div>
      </div>
    </div>
  );
};

export default SortableItem;
