import Quill from "quill";
import QuillBetterTable from "quill-better-table";
import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";

// Register the better-table module
Quill.register(
  {
    "modules/better-table": QuillBetterTable,
  },
  true
);

export const modules = {
  table: false, // disable default table module
  "better-table": {
    operationMenu: {
      items: {
        unmergeCells: {
          text: "Another unmerge cells name",
        },
      },
    },
  },
  keyboard: {
    bindings: QuillBetterTable.keyboardBindings,
  },
  toolbar: [
    ["bold", "italic", "underline"],
    [{ header: [1, 2, false] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};
