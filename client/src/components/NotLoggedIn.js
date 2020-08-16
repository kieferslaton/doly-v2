import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { FaSignInAlt, FaCheckDouble, FaRegUserCircle } from "react-icons/fa";

import Login from "./Login";
import Register from "./Register";

import hero from "../hero.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
  },
  appBar: {
    backgroundColor: "#4864e1",
  },
  title: {
    fontWeight: "bold",
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  button: {
    height: "100%",
    borderRadius: 0,
    padding: theme.spacing(1),
    "&:first-of-type": {
      borderRight: "1px solid white",
      [theme.breakpoints.down("sm")]: {
        border: "none",
      },
    },
  },
  mobile: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  desktop: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  image: {
    maxWidth: "100%",
    margin: 0,
  },
  container: {
    marginTop: 10,
  },
  row: {
    display: "flex",
    flexFlow: "row wrap",
    marginTop: 0,
    [theme.breakpoints.down("sm")]: {
      marginTop: 20,
    },
  },
  grid: {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 20px",
  },
  headers: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "calc(2.5rem + 3vw)",
    lineHeight: "calc(1rem + 7vw)",
  },
  subItem: {
    display: "block",
    [theme.breakpoints.down("sm")]: {
      borderBottom: "1px solid #d3d3d3",
      margin: "0 auto",
    },
    [theme.breakpoints.up("md")]: {
      borderRight: "1px solid #d3d3d3",
      marginTop: theme.spacing(5),
    },
    "&:last-of-type": {
      border: "none",
    },
  },
  subHeaders: {
    textAlign: "center",
    fontWeight: 400,
    color: "#d95050",
    margin: theme.spacing(1),
  },
  subText: {
    color: "#d3d3d3",
    fontSize: "1.2rem",
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

const NotLoggedIn = () => {
  const classes = useStyles();

  const [show, setShow] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            do.ly <FaCheckDouble />
          </Typography>
          <Button
            className={classes.button}
            onClick={() => {
              setIsLogin(true);
              setShow(true);
            }}
            color="inherit"
          >
            <span className={classes.desktop}>Login</span>
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              setIsLogin(false);
              setShow(true);
            }}
            color="inherit"
          >
            <span className={classes.desktop}>Sign Up</span>
          </Button>
          <IconButton
            color="inherit"
            onClick={() => {
              setIsLogin(true);
              setShow(true);
            }}
            className={classes.mobile}
          >
            <FaSignInAlt />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              setIsLogin(false);
              setShow(true);
            }}
            className={classes.mobile}
          >
            <FaRegUserCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        <Grid container className={classes.row} spacing={3}>
          <Grid className={classes.grid} item xs={12} md={5}>
            <Typography variant="h1" className={classes.headers}>
              Do <span style={{ color: "#799ff2" }}>More.</span> <br />
              Stress <span style={{ color: "#4864e1" }}>Less.</span>
            </Typography>
          </Grid>
          <Grid className={classes.grid} item xs={12} md={7}>
            <img className={classes.image} src={hero} alt="hero" />
          </Grid>
        </Grid>
      </Container>
      <Container className={classes.container}>
        <Grid container className={classes.row} spacing={3}>
          <Grid className={classes.subItem} item xs={10} md={4}>
            <Paper elevation={0} className={classes.paper}>
              <Typography variant="h5" className={classes.subHeaders}>
                Get Stuff Done.
              </Typography>
              <Typography variant="body1" className={classes.subText}>
                Do.ly operates using GTD principles to help you get more done,
                in less time, with less stress.
              </Typography>
            </Paper>
          </Grid>
          <Grid className={classes.subItem} item xs={10} md={4}>
            <Paper elevation={0} className={classes.paper}>
              <Typography variant="h5" className={classes.subHeaders}>
                Be On Time.
              </Typography>
              <Typography variant="body1" className={classes.subText}>
                Coming soon, Do.ly's calendar feature will make sure you're on
                time to every appointment.
              </Typography>
            </Paper>
          </Grid>
          <Grid className={classes.subItem} item xs={10} md={4}>
            <Paper elevation={0} className={classes.paper}>
              <Typography variant="h5" className={classes.subHeaders}>
                Work With Others.
              </Typography>
              <Typography variant="body1" className={classes.subText}>
                Coming soon, Do.ly will support shared tasks and projects so
                your team can be successful.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>{isLogin ? "Log In" : "Sign Up"}</DialogTitle>
        <DialogContent>{isLogin ? <Login /> : <Register />}</DialogContent>
      </Dialog>
    </div>
  );
};

export default NotLoggedIn;
