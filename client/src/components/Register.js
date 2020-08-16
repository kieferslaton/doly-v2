import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Container, Button } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import { gql, useMutation, useQuery } from "@apollo/client";

const CREATE_USER = gql`
  mutation($username: String!, $password: String!, $email: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        username
        password
      }
    }
  }
`;

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
      email
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(2, 0),
  },
  passHelper: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    display: "flex",
    alignItems: "center",
  },
  hidden: {
    display: "none",
  },
}));

const Register = () => {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [passLength, setPassLength] = useState(false);
  const [passNums, setPassNums] = useState(false);

  const { data } = useQuery(USERNAMES);

  const [createUser] = useMutation(CREATE_USER);
  const [tokenAuth, { client }] = useMutation(TOKEN_AUTH);

  const handleUserChange = (e) => {
    setUsername(e.target.value);
    if (data.users.find((user) => user.username === e.target.value)) {
      setUserError(true);
    } else {
      setUserError(false);
    }
  };

  const handlePassChange = (e) => {
    setPassword(e.target.value);
    e.target.value.length > 8 ? setPassLength(true) : setPassLength(false);
    let test = /\d/g.test(e.target.value);
    test ? setPassNums(true) : setPassNums(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userError && passLength && passNums) {
      if (password !== password2) {
        setPassError(true);
      } else {
        setPassError(false);
        createUser({
          variables: {
            username: username,
            password: password,
            email: email,
          },
        })
          .then((res) => {
            console.log(res);
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
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          required
          id="email"
          label="Email"
          name="email"
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          error={userError}
          helperText={userError ? "Username already exists." : ""}
          variant="outlined"
          margin="normal"
          fullWidth
          required
          id="username"
          label="Username"
          name="username"
          onChange={(e) => handleUserChange(e)}
        />
        <TextField
          helperText={
            <>
              <p className={classes.passHelper}>
                Password must be at least 8 characters long.
                <Check className={passLength ? "" : classes.hidden} />
              </p>
              <p className={classes.passHelper}>
                Password must contain at least one number.
                <Check className={passNums ? "" : classes.hidden} />
              </p>
            </>
          }
          variant="outlined"
          margin="normal"
          fullWidth
          required
          id="password"
          label="Password"
          name="password"
          type="password"
          onChange={(e) => handlePassChange(e)}
        />
        <TextField
          error={passError}
          helperText={passError ? "Passwords don't match." : ""}
          variant="outlined"
          margin="normal"
          fullWidth
          required
          id="password2"
          label="Type Password Again"
          name="password2"
          type="password"
          onChange={(e) => setPassword2(e.target.value)}
        />
        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          margin="normal"
          fullWidth
        >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
