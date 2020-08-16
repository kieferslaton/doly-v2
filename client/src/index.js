import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
  uri: "https://doly-db.herokuapp.com/graphql/",
  fetchOptions: {
    credentials: "include",
  },
  request: (operation) => {
    const token = localStorage.getItem("authToken") || "";
    operation.setContext({
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
  },
  clientState: {
    defaults: {
      isLoggedIn: !!localStorage.getItem("authToken"),
    },
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
