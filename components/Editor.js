import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";
import React from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Editor({
  richText,
  setRichText,
  placeholder,
  name,
  resetError,
  errorFields,
}) {
  return (
    <ReactQuill
      name={name}
      className={`${errorFields.includes(name) ? "ql-error" : ""} `}
      onFocus={() => resetError(name)}
      theme={"snow"}
      onChange={setRichText}
      value={richText}
      modules={modules}
      formats={formats}
      bounds={".app"}
      placeholder={placeholder}
    />
  );
}

/*
 * Quill modules to attach to editor
 */
const modules = {
  toolbar: [
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 */
const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];
