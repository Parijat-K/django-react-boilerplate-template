import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  AppBar,
  Container,
  CssBaseline,
  InputBase,
  IconButton,
  Toolbar,
  Typography,
  Link,
  List,
  ListItem,
  TextField,
  Button,
  Checkbox,
  Grid,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
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

function ToDoView({ userdetails }) {
  const classes = useStyles();
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  let history = useHistory();

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

  const getData = React.useCallback(() => {
    var url = `${config.base_url}/api/todo`;
    (loading) && fetch(url, {
      method: 'GET',
      credentials: config.credentials
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          return [];
        } else if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return [];
        }
      })
      .then(res => {
        setTodos(res);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Something went wrong with connection!:', error);
      });
  }, [loading]);

  React.useEffect(getData, [loading]);

  function handleRemove(id) {

  }

  function handleCheck(id, checkStatus) {
    todos[id].is_complete = checkStatus;
  }

  function handleAdd(todo) {

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
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          To-Do list
        </Typography>
        <TodoList
          todos={todos}
          handleRemove={handleRemove}
          handleCheck={handleCheck}
        />
        <br />
        <AddTodo handleAdd={handleAdd} />
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

function TodoList({ todos, handleRemove, handleCheck }) {
  var todoNode = todos.map((todo, index) => {
    return (
      <Todo
        key={index}
        todo={todo.task}
        id={index}
        checked={todo.is_complete}
        handleRemove={handleRemove}
        handleCheck={handleCheck}
      />
    )
  });

  return (
    <List style={{ marginLeft: '5%' }}>
      {todoNode}
    </List>
  )
}

const listElementStyles = {
  fontSize: 18,
  lineHeight: '24px',
}

const listElementCheckedStyles = {
  ...listElementStyles,
  textDecoration: 'line-through',
}

function Todo({ todo, id, checked, handleRemove, handleCheck }) {

  const [selected, setSelected] = React.useState(checked);  
  const listStyles = !selected ? listElementStyles : listElementCheckedStyles;

  function onClick(event) {
    handleRemove(id)
  }

  function onCheck(event) {
    setSelected(event.target.checked);
    handleCheck(id, selected);
  }

  return (
    <ListItem key={id} divider={true} style={listStyles}>
      <ListItemText id={id} primary={todo} />
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={selected}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': id }}
          onChange={onCheck}
        />
      </ListItemIcon>
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={onClick}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  
  )
}

function AddTodo({ handleAdd }) {

  const [inputValue, setInputValue] = React.useState("");

  function onClick(event) {
    event.preventDefault();
    var todo = inputValue;
    if (todo === '') return
    else {
      var form = document.getElementById("myForm");
      form.reset()
      handleAdd(todo);
      setInputValue("");
    }
  }

  return (
    <Container>
      <form id="myForm">
        <Grid container spacing={1}>
          <Grid item xs={11}>
            <TextField
              fullWidth={true}
              onChange={(e) => setInputValue(e.target.value)}
            >
            </TextField>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" type="submit" primary="true" onClick={onClick}>
              Add
              </Button>
          </Grid>
        </Grid>

      </form>

    </Container>
  );

}

export default ToDoView;