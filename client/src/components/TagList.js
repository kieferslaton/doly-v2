import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

import Todo from "./Todo";
import TodoMobile from "./TodoMobile";
import {
  TableContainer,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableRow,
  Hidden,
  List,
  Typography,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export const TODO_QUERY = gql`
  query {
    todos {
      task
      due
      tags
      complete
      hasDueDate
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  tagHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(0),
    },
    [theme.breakpoints.down("sm")]: {
      "&:first-of-type": {
        marginTop: -10,
      },
    },
  },
}));

const TodoList = () => {
  const classes = useStyles();
  const [globalTags, setGlobalTags] = useState([]);
  const [tagList, setTagList] = useState([]);

  const { data, loading } = useQuery(TODO_QUERY);

  useEffect(() => {
    if (!loading && data) {
      let tags = [];
      data.todos.forEach((todo) => {
        todo.tags.forEach((tag) => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      });

      let tagTodoList = [];

      tags.forEach((tag) => {
        let tagTodos = {
          name: tag,
          todos: [],
        };
        data.todos.forEach((todo) => {
          if (todo.tags.includes(tag)) {
            tagTodos.todos.push(todo);
          }
        });
        tagTodoList.push(tagTodos);
      });

      setGlobalTags(tags);
      setTagList(tagTodoList);
    }
  }, [data, loading]);

  return loading ? (
    ""
  ) : (
    <>
      <Hidden smDown implementation="css">
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableBody>
              {tagList.map((tag) => (
                <>
                  <TableRow>
                    <TableCell colSpan={5} className={classes.tagHeader}>
                      <Typography variant="h6" style={{ margin: 10 }}>
                        {tag.name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {tag.todos.map((todo) => (
                    <Todo todo={todo} key={todo.id} globalTags={globalTags} />
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Hidden>
      <Hidden mdUp implementation="css">
        <List component={Paper} style={{ marginTop: 20 }}>
          {tagList.map((tag) => (
            <>
              <ListItem className={classes.tagHeader}>
                <ListItemText>{tag.name}</ListItemText>
              </ListItem>
              {tag.todos.map((todo) => (
                <TodoMobile todo={todo} key={todo.id} globalTags={globalTags} />
              ))}
            </>
          ))}
        </List>
      </Hidden>
    </>
  );
};

export default TodoList;
