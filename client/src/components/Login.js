import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Container, Button } from "@material-ui/core";
import { gql, useMutation, useQuery } from "@apollo/client";

const TOKEN_AUTH = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

const USERNAMES = gql`
  query {
    users {
      username
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(2, 0),
  },
}));

const Login = (props) => {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);

  const { data } = useQuery(USERNAMES);

  const [tokenAuth, { client }] = useMutation(TOKEN_AUTH);

  const handleSubmit = (e) => {
    e.preventDefault();
    tokenAuth({
      variables: {
        username: username,
        password: password,
      },
    })
      .then((res) => {
        const token = res.data.tokenAuth.token;
        localStorage.setItem("authToken", token);
        client.writeData({ data: { isLoggedIn: true } });
      })
      .catch((err) => {
        if (err) {
          console.log("error");
          if (!data.users.find((user) => user.username === username)) {
            console.log("no user");
            setUserError(true);
            setPassError(false);
          } else {
            setUserError(false);
            setPassError(true);
          }
        }
      });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          error={userError}
          helperText={userError ? "Username not found." : ""}
          variant="outlined"
          margin="normal"
          fullWidth
          required
          id="username"
          label="Username"
          name="username"
          autoFocus
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          error={passError}
          helperText={passError ? "Password is incorrect." : ""}
          variant="outlined"
          margin="normal"
          fullWidth
          required
          id="password"
          label="Password"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          margin="normal"
          fullWidth
        >
          Log In
        </Button>
      </form>
    </Container>
  );
};

export default Login;
