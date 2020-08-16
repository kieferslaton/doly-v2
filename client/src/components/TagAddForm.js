import React, { useState, useEffect } from "react";
import { MenuItem, TextField } from "@material-ui/core";

const TagAddForm = ({ handleTagAdd, globalTags }) => {
  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!text.length) {
      setOptions([]);
    } else {
      let tags = [];
      globalTags.forEach((tag) => {
        if (tag.toLowerCase().startsWith(text.toLowerCase())) {
          tags.push(tag);
        }
      });
      setOptions(tags);
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.length) {
      handleTagAdd(text);
      setText("");
    }
  };

  return (
    <>
      <MenuItem>
        <form onSubmit={handleSubmit}>
          <TextField onChange={(e) => setText(e.target.value)} />
        </form>
      </MenuItem>
      {options.map((option) => (
        <MenuItem
          onClick={() => {
            handleTagAdd(option);
            setText("");
          }}
          key={option}
        >
          {option}
        </MenuItem>
      ))}
    </>
  );
};

export default TagAddForm;
