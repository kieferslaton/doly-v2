import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import { useMutation, gql } from "@apollo/client";
import moment from "moment";

import { TODO_QUERY } from "./TodoList";

const ADD_TODO = gql`
  mutation($task: String!, $due: DateTime!) {
    createTodo(
      task: $task
      due: $due
      complete: false
      hasDueDate: false
      tags: []
    ) {
      todo {
        task
      }
    }
  }
`;

const NewTodo = () => {
  const [todo, setTodo] = useState("");

  const [addTodo] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: TODO_QUERY }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let task = todo;
    let due = moment().format(moment.defaultFormatUtc);
    addTodo({
      variables: {
        task: task,
        due: due,
      },
    });
    setTodo("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        variant="standard"
        fullWidth
        placeholder="New Task"
        value={todo}
        inputProps={{ style: { textAlign: "center" } }}
        onChange={(e) => setTodo(e.target.value)}
      />
    </form>
  );
};

export default NewTodo;
