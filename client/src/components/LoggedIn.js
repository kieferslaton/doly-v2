import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Hidden,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Divider,
} from "@material-ui/core";
import {
  FaInbox,
  FaTags,
  FaSignOutAlt,
  FaCheckDouble,
  FaBars,
} from "react-icons/fa";
import { ApolloConsumer } from "@apollo/client";

import Inbox from "./Inbox";
import Tags from "./Tags";

const ME_QUERY = gql`
  query {
    me {
      username
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: 200,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: 200,
  },
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    fontWeight: "bold",
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  menuButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  link: {
    textDecoration: "none",
  },
  listItem: {
    "&:hover": {
      background: "#d3d3d3",
      cursor: "pointer",
    },
  },
  listText: {
    color: "#292b2c",
  },
  logout: {
    position: "fixed",
    bottom: 0,
    width: 200,
    borderTop: "1px solid #d3d3d3",
    cursor: "pointer",
    "&:hover": {
      background: "#d3d3d3",
    },
  },
  gridItem: {
    margin: "0 auto",
  },
}));

const LoggedIn = () => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data, error, loading } = useQuery(ME_QUERY);

  if (error) console.log(error);

  const renderDrawer = (client) => {
    return (
      <>
        <div className={classes.drawerContainer}>
          <List>
            <Link to="/" className={classes.link}>
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <FaInbox size={30} />
                </ListItemIcon>
                <ListItemText className={classes.listText}>Inbox</ListItemText>
              </ListItem>
            </Link>
            <Divider />
            <Link to="/tags" className={classes.link}>
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <FaTags size={30} />
                </ListItemIcon>
                <ListItemText className={classes.listText}>Tags</ListItemText>
              </ListItem>
            </Link>
            <ListItem
              className={classes.logout}
              onClick={() => {
                localStorage.removeItem("authToken");
                client.writeData({ data: { isLoggedIn: false } });
              }}
            >
              <ListItemIcon>
                <FaSignOutAlt size={30} />
              </ListItemIcon>
              <ListItemText>Log Out</ListItemText>
            </ListItem>
          </List>
        </div>
      </>
    );
  };

  return loading ? (
    ""
  ) : (
    <ApolloConsumer>
      {(client) => (
        <Router>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar className={classes.appBar} position="fixed">
              <Toolbar>
                <Typography className={classes.title} variant="h6">
                  do.ly <FaCheckDouble />
                </Typography>
                <Typography>{data.me.username}</Typography>
                <IconButton
                  color="inherit"
                  className={classes.menuButton}
                  onClick={() => setMobileOpen(true)}
                >
                  <FaBars />
                </IconButton>
              </Toolbar>
            </AppBar>
            <nav className={classes.drawer}>
              <Hidden smUp implementation="css">
                <Drawer
                  variant="temporary"
                  anchor="right"
                  open={mobileOpen}
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                  onClose={() => setMobileOpen(false)}
                >
                  {renderDrawer(client)}
                </Drawer>
              </Hidden>
              <Hidden xsDown implementation="css">
                <Drawer
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                  variant="permanent"
                  anchor="left"
                  open
                >
                  <Toolbar />
                  {renderDrawer(client)}
                </Drawer>
              </Hidden>
            </nav>

            <Switch>
              <Route exact path="/">
                <Inbox />
              </Route>
              <Route path="/tags">
                <Tags />
              </Route>
            </Switch>
          </div>
        </Router>
      )}
    </ApolloConsumer>
  );
};

export default LoggedIn;
