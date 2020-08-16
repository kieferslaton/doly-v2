import React from "react";
import { gql, useQuery } from "@apollo/client";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import NotLoggedIn from "./components/NotLoggedIn";
import LoggedIn from "./components/LoggedIn";

const LOGIN_QUERY = gql`
  query {
    isLoggedIn @client
  }
`;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4864e1",
    },
  },
});

const App = () => {
  const { data } = useQuery(LOGIN_QUERY);

  return (
    <MuiThemeProvider theme={theme}>
      {data.isLoggedIn ? <LoggedIn /> : <NotLoggedIn />}
    </MuiThemeProvider>
  );
};

export default App;
