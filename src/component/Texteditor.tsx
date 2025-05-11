"use client";
import React from "react";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const MyTextEditor = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (p: string) => void;
  error: string;
}) => {
  const config = {
    readonly: false,
    height: 400,
    toolbarAdaptive: false,
    toolbarButtonSize: "middle" as const,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "align",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "image",
      "table",
      "link",
      "|",
      "undo",
      "redo",
      "|",
      "fullsize",
    ],
    style: {
      table: "border-collapse: collapse; width: 100%;",
      "td, th": "border: 1px solid #ddd; padding: 8px;",
    },
  };

  return (
    <div>
      <JoditEditor
      className=" text-white bg-black"
        value={value}
        config={config}
        onBlur={(newContent: string) => onChange(newContent)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div style={{ marginTop: "20px" }}>
        <h3>Preview:</h3>
        <div className="text-white  p-2" dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
};

export default MyTextEditor;
