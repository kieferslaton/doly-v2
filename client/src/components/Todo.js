import React, { useState } from "react";
import {
  TableCell,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
  Menu,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  FaTrash,
  FaRegCheckCircle,
  FaRegCircle,
  FaCalendar,
} from "react-icons/fa";
import { AddCircle } from "@material-ui/icons";
import { useMutation, gql } from "@apollo/client";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";

import { TODO_QUERY } from "./TodoList";
import TagAddForm from "./TagAddForm";

const DELETE_TODO = gql`
  mutation($id: Int!) {
    deleteTodo(todoId: $id) {
      todoId
    }
  }
`;

const UPDATE_TODO = gql`
  mutation(
    $todoId: Int!
    $task: String!
    $due: DateTime!
    $complete: Boolean!
    $hasDueDate: Boolean!
    $tags: [String]
  ) {
    updateTodo(
      todoId: $todoId
      task: $task
      due: $due
      complete: $complete
      hasDueDate: $hasDueDate
      tags: $tags
    ) {
      todo {
        id
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  chipList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  dateTime: {
    maxWidth: 125,
  },
  trash: {
    "&:hover": {
      color: "#d95050",
      cursor: "pointer",
    },
  },
}));

const Todo = ({ todo, globalTags }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState();

  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: TODO_QUERY }],
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: TODO_QUERY }],
  });

  const toggleComplete = () => {
    updateTodo({
      variables: {
        todoId: todo.id,
        task: todo.task,
        due: moment(todo.due).format(moment.defaultFormatUtc),
        hasDueDate: todo.hasDueDate,
        tags: todo.tags,
        complete: !todo.complete,
      },
    }).catch((err) => console.log(err));
  };

  const handleDateChange = (date) => {
    updateTodo({
      variables: {
        todoId: todo.id,
        task: todo.task,
        due: moment(date).format(moment.defaultFormatUtc),
        hasDueDate: true,
        tags: todo.tags,
        complete: todo.complete,
      },
    });
  };

  const handleTagAdd = (tag) => {
    let tags = todo.tags;
    if (!tags.includes(tag)) {
      tags.push(tag);

      updateTodo({
        variables: {
          todoId: todo.id,
          task: todo.task,
          due: moment(todo.due).format(moment.defaultFormatUtc),
          hasDueDate: todo.hasDueDate,
          complete: todo.complete,
          tags: tags,
        },
      });
    }

    setAnchorEl(null);
  };

  const handleTagDelete = (tag) => {
    let tags = todo.tags.filter((t) => t !== tag);
    console.log(tags);

    updateTodo({
      variables: {
        todoId: todo.id,
        task: todo.task,
        due: moment(todo.due).format(moment.defaultFormatUtc),
        hasDueDate: todo.hasDueDate,
        complete: todo.complete,
        tags: tags,
      },
    });
  };

  return (
    <>
      <TableRow key={todo.id}>
        <TableCell>
          <IconButton onClick={() => toggleComplete()}>
            {todo.complete ? (
              <FaRegCheckCircle size={20} />
            ) : (
              <FaRegCircle size={20} />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{todo.task}</TableCell>
        <TableCell>
          <div className={classes.chipList}>
            {todo.tags.map((tag) => (
              <li key={tag}>
                <Chip
                  variant="outlined"
                  onDelete={() => handleTagDelete(tag)}
                  label={tag}
                  className={classes.chip}
                />
              </li>
            ))}
            <Chip
              variant="outlined"
              label="Add Tag"
              onDelete={(e) => setAnchorEl(e.currentTarget)}
              deleteIcon={<AddCircle />}
              className={classes.chip}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <TagAddForm handleTagAdd={handleTagAdd} globalTags={globalTags} />
            </Menu>
          </div>
        </TableCell>
        <TableCell className={classes.dateTime}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              clearable
              onChange={(date) => handleDateChange(date)}
              value={todo.hasDueDate ? moment(todo.due).add(5, "hours") : null}
              helperText={todo.hasDueDate ? "" : "Add Due Date"}
              format="MM/DD/YY"
              InputProps={{
                endAdornment: (
                  <InputAdornment positon="end">
                    <IconButton>
                      <FaCalendar size={15} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </MuiPickersUtilsProvider>
        </TableCell>
        <TableCell>
          <IconButton
            className={classes.trash}
            onClick={() =>
              deleteTodo({
                variables: {
                  id: todo.id,
                },
              })
            }
          >
            <FaTrash size={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Todo;
