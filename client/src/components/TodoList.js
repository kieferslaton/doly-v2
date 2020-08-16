import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

import Todo from "./Todo";
import TodoMobile from "./TodoMobile";
import {
  TableContainer,
  Table,
  Paper,
  TableBody,
  Hidden,
  List,
} from "@material-ui/core";

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

const TodoList = () => {
  const [globalTags, setGlobalTags] = useState([]);

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
      setGlobalTags(tags);
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
              {data.todos.map((todo) => (
                <Todo todo={todo} key={todo.id} globalTags={globalTags} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Hidden>
      <Hidden mdUp implementation="css">
        <List component={Paper} style={{ marginTop: 20 }}>
          {data.todos.map((todo) => (
            <TodoMobile todo={todo} key={todo.id} globalTags={globalTags} />
          ))}
        </List>
      </Hidden>
    </>
  );
};

export default TodoList;
