import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import {
  AppBar,
  Container,
  CssBaseline,
  InputBase,
  IconButton,
  Toolbar,
  Typography,
  Link,
  Menu,
  MenuItem
} from '@material-ui/core';
import { useHistory, useLocation } from "react-router-dom";
import { config } from './config';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function ToDoList({ userdetails }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  let history = useHistory();
  let location = useLocation();

  function signoff() {
    var url = `${config.base_url}/auth/logout`;
    fetch(url, {
      method: 'GET',
      credentials: config.credentials
    })
      .then(response => {
        if (!response.ok) {
          return { 'success': false };
        } else {
          return { 'success': true };
        }
      })
      .then(res => {
        if ('success' in res && res['success']) {
          sessionStorage.clear();
          history.push('/');
        }
      })
      .catch((error) => {
        console.error('Something went wrong with connection!:', error);
      });
  }

  return (
    <section className={classes.root}>
      <CssBaseline />
      {/* Application Header Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {`${userdetails.first_name}'s To-Do list`}
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div>
            <IconButton
              aria-label="Sign Off"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={signoff}
              color="inherit"
            >
              <PowerSettingsNewIcon />
            </IconButton>

          </div>
        </Toolbar>
      </AppBar>

      {/* Main Body */}
      <Container component="main" className={classes.main} maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom>
          Placeholder Title
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {'Placeholder line 1.'}
          {'Placeholder line 2'}
        </Typography>
        <Typography variant="body1">Placeholder body.</Typography>
      </Container>

      {/* Sticky Footer */}
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Copyright />
        </Container>
      </footer>

    </section>
  );

}

export default ToDoList;