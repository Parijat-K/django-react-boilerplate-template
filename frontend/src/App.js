import React, { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import SignIn from './LoginView';
import ToDoView from './ToDoView';

function App() {
  return (
    <Router>
      <AppEntry />
    </Router>
  )
}

function AppEntry() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user') || '{}'));

  function updateUserInfo(userDetail) {
    setUser(userDetail);
    sessionStorage.setItem("user", JSON.stringify(userDetail));
    sessionStorage.setItem('loggedin', true);
  }

  // A wrapper for <Route> that redirects to the login
  // screen if you're not yet authenticated.
  function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          (sessionStorage.getItem('loggedin') != null && sessionStorage.getItem('loggedin')) ? (
            children
          ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location }
                }}
              />
            )
        }
      />
    );
  }

  return (
    <section>
      <Switch>
        <Route path="/login">
          {/* 
          Sign In control - Feel free to customize
           */}
          <SignIn updateUserInfo={updateUserInfo} />
        </Route>
        <PrivateRoute path="*">
          {/* 
            Main Application
            -- Feel free to switch with your own Application
          */}
          <ToDoView userdetails={user} />
        </PrivateRoute>
      </Switch>
    </section>
  );
}

export default App;
