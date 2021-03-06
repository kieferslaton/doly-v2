import React from "react";
import { Toolbar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import NewTodo from "./NewTodo";
import TagList from "./TagList";

const useStyles = makeStyles((theme) => ({
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  gridItem: {
    margin: "0 auto",
  },
}));

const Tags = () => {
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <Toolbar />
      <Grid container>
        <Grid className={classes.gridItem} item xs={12} md={6}>
          <NewTodo />
        </Grid>
      </Grid>
      <Grid container>
        <Grid className={classes.gridItem} item xs={12}>
          <TagList />
        </Grid>
      </Grid>
    </div>
  );
};

export default Tags;
