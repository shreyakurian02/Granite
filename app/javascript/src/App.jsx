import React, { useEffect, useState } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ShowTask from "components/Tasks/ShowTask";
import EditTask from "components/Tasks/EditTask";
import CreateTask from "components/Tasks/CreateTask";
import Dashboard from "components/Dashboard";
import PageLoader from "components/PageLoader";
import { registerIntercepts, setAuthHeaders } from "apis/axios";
import { initializeLogger } from "common/logger";
import Signup from "components/Authentication/Signup";
import { either, isEmpty, isNil } from "ramda";
import Login from "components/Authentication/Login";
import PrivateRoute from "components/Common/PrivateRoute";
import { getFromLocalStorage } from "helpers/storage";

const App = () => {
  const [loading, setLoading] = useState(true);
  const authToken = getFromLocalStorage("authToken");

  const isLoggedIn = !either(isNil, isEmpty)(authToken) && authToken !== "null";

  useEffect(() => {
    initializeLogger();
    registerIntercepts();
    setAuthHeaders(setLoading);
  }, []);

  if (loading) {
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/tasks/:slug/edit" component={EditTask} />
        <Route exact path="/tasks/:slug/show" component={ShowTask} />
        <Route exact path="/tasks/create" component={CreateTask} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute
          path="/"
          redirectRoute="/login"
          condition={isLoggedIn}
          component={Dashboard}
        />
      </Switch>
      <ToastContainer />
    </Router>
  );
};

export default App;
