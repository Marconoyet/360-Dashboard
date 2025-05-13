import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem/SortableItem";
import styles from "./EditableList.module.css";
import { useTranslation } from "react-i18next";

// Function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

const EditableList = ({ sectionKey, listData, onEdit }) => {
  const { t, i18n } = useTranslation();

  // ✅ Detect if listData is a simple list (bullet points)
  const isSimpleList = typeof listData[0] === "string";

  // Ensure every item has an ID
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(
      listData.map((item) =>
        isSimpleList
          ? { id: generateId(), text: item }
          : { ...item, id: item.id || generateId() }
      )
    );
  }, [listData]);

  // ✅ Ensure onChange updates state immediately
  const handleChange = (index, key, value) => {
    setItems((prevItems) => {
      const updatedList = prevItems.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      );

      // ✅ Immediately trigger state update
      onEdit(isSimpleList ? updatedList.map((item) => item.text) : updatedList);
      return updatedList;
    });
  };

  // Handle deleting an item
  const handleDelete = (index) => {
    const updatedList = items.filter((_, i) => i !== index);
    setItems(updatedList);
    onEdit(isSimpleList ? updatedList.map((item) => item.text) : updatedList);
  };

  // Handle adding a new item
  const handleAdd = () => {
    const newItem = isSimpleList
      ? { id: generateId(), text: "New Bullet Point" }
      : {
          id: generateId(),
          title: "New Title",
          description: "New Description",
        };

    const updatedList = [...items, newItem];
    setItems(updatedList);
    onEdit(isSimpleList ? updatedList.map((item) => item.text) : updatedList);
  };

  // Handle drag & drop reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prevItems) => {
      const oldIndex = prevItems.findIndex((item) => item.id === active.id);
      const newIndex = prevItems.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove([...prevItems], oldIndex, newIndex);
        onEdit(isSimpleList ? newItems.map((item) => item.text) : newItems);
        return newItems;
      }

      return prevItems; // ✅ Prevent crashes if indexes are not found
    });
  };

  return (
    <div className={styles.listContainer}>
      <h3 className={styles.header}>
        {sectionKey.replace(/_/g, " ").toUpperCase()}
      </h3>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.list}>
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                id={item.id}
                item={item}
                index={index}
                isSimpleList={isSimpleList} // ✅ Pass if it's a simple list
                onChange={handleChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button className={styles.addButton} onClick={handleAdd}>
        <FaPlus /> {t("buttons.addItem")}
      </button>
    </div>
  );
};

export default EditableList;
