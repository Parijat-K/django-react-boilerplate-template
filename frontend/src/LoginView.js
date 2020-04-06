import React, { useState, useEffect } from 'react';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  Box,
  CssBaseline,
  Link,
  Container,
  Typography,
  TextField,
  CircularProgress
} from '@material-ui/core';

import { useHistory, useLocation } from "react-router-dom";
import { config } from "./config"

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  fabProgress: {
    position: 'absolute',
    top: '40%',
    zIndex: 1,
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn({ updateUserInfo }) {
  const classes = useStyles();

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [csrfmiddlewaretoken, setCsrfmiddlewaretoken] = useState("");

  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    var url = `${config.base_url}/auth/login`;
    (loading) && fetch(url, {
      method: 'GET',
      credentials: config.credentials,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
    })
      .then(response => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      }).then(res => {
        if ('csrfmiddlewaretoken' in res) {
          setCsrfmiddlewaretoken(res['csrfmiddlewaretoken'])
        }
        setLoading(false);
      }).catch((error) => {
        console.error('Something went wrong with connection!:', error);
        setLoading(false);
      });
  }, [loading]);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(event.target);
    formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken);

    var loginSuccess = false;
    var submitFailedTemp = false;
    var url = `${config.base_url}/auth/login`;
    fetch(url, {
      headers: {
        'Accept': 'application/json'
      },
      method: 'POST',
      credentials: config.credentials,
      body: formData
    }).then(response => {
      if (!response.ok) {
        submitFailedTemp = true;
        return {};
      }
      return response.json();
    }).then(data => {
      var errorMsg = "";
      if (submitFailedTemp) {
        errorMsg = "Failed to authenticate, try again!";
      }
      if ("success" in data) {
        if (!data["success"]) {
          errorMsg = data["error"];
        } else {
          loginSuccess = true;
          updateUserInfo(data["user_detail"]);
        }
      }
      else {
        errorMsg = "Login attempt failed, try again!";
      }
      setErrorMsg(errorMsg);
      setSubmitting(false);
      if (loginSuccess) {
        let { from } = location.state || { from: { pathname: "/" } };
        history.push(from);
      }
    });
  }

  return (
    <div className={classes.wrapper}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            error={errorMsg.trim() !== ""}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={errorMsg.trim() !== ""}
          />
          <Typography color="error">
            {errorMsg}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
        
    {(loading || submitting) && <CircularProgress size={68} className={classes.fabProgress} />}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      
    </Container>
    </div>
  );
}