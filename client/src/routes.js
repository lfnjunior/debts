import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import PrivateRoute from "./services/private-route";
import PublicRoute from "./services/public-route";
import Login from "./pages/public/login";
import NewUser from "./pages/public/new-user";
import Debtors from "./pages/private/debtors";
import Debtor from "./pages/private/debtor";
import Debt from "./pages/private/debt";
import User from "./pages/private/user";

export default function Routes() {
  return (
    <SnackbarProvider maxSnack={5}>
      <BrowserRouter>
        <Switch>
          <PublicRoute component={Login} restricted={true} path="/" exact />
          <PublicRoute
            component={NewUser}
            restricted={true}
            path="/newuser"
            exact
          />
          <PrivateRoute component={Debtors} path="/devedores" exact />
          <PrivateRoute component={Debtor} path="/devedor/:id" exact />
          <PrivateRoute component={Debt} path="/divida" exact />
          <PrivateRoute component={Debt} path="/divida/:id" exact />
          <PrivateRoute component={User} path="/user" exact />
        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  );
}
