import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AuthService from '../services/authService';
import ErrorBox from '../components/dialog/errorBox';
import NotificationBox from '../components/dialog/notificationBox';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'grey',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#B2C8D6',
    "&:hover": {
      backgroundColor: '#F59B69',
    }
  },
  
}));

export default function Auth(props) {
  const classes = useStyles();
  let history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checked, setChecked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [closeNotification, setCloseNotification] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const notificationBoxCallback = open => {
    setCloseNotification(open);
  }

  const register = () => {
    if(props.actionName === 'Регистрация'){
      setIsError(false);
      const isOrganizer = checked;
      AuthService.register({email, password, username, isOrganizer, name, surname, dateOfBirth}).then(x => {
        setShowNotification(true);
          history.push('/login');
      }).catch(err => {
        if(err.status == 400){
          setErrorMessage(err.data.message);
          setIsError(true);
        }
        if(err.status == 403){
          setErrorMessage('Вам запрещено делать этот запрос');
          setIsError(true);
      }
        else if(err.status == 500){
          setErrorMessage('Непредвиденная ошибка. Обратитесь к Администратору');
          setIsError(true);
        }
    })
  }
    
    else{
      setIsError(false);
      AuthService.login({email, password}).then(x => {
        localStorage.setItem('token', x.token);
        localStorage.setItem('user', JSON.stringify(x.user));
        history.push('/');
      }).catch(err => {
        console.log('ERERERE', err)
        if(err.status == 401){
          setErrorMessage(err.data.message);
          setIsError(true);
        }
        if(err.status == 403){
          setErrorMessage('Вам запрещено делать этот запрос');
          setIsError(true);
      }
        else if(err.status == 500){
          setErrorMessage('Непредвиденная ошибка. Обратитесь к Администратору');
          setIsError(true);
        }
    });
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {props.actionName}
        </Typography>
        <form className={classes.form}>
        {props.actionName === 'Регистрация' ?
        <>
          <Grid container alignItems="flex-start" justify="space-between">
            <Grid item xs={6}>
            <TextField
            style={{paddingRight: 5}}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Имя"
              name="name"
              onChange={e => setName(e.target.value)}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="surname"
              label="Фамилия"
              name="surname"
              onChange={e => setSurname(e.target.value)}
            />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                type="date"
                fullWidth
                id="dateOfBirth"
                InputLabelProps={{ shrink: true, required: true }}
                label="Дата рождения"
                name="dateOfBirth"
                onChange={e => setDateOfBirth(e.target.value)}
              />
            </Grid>
          </Grid>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Логин"
              name="username"
              onChange={e => setUsername(e.target.value)}
            />
            </>
          : <></>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Адрес почты"
            name="email"
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
          />
          {props.actionName === 'Регистрация' ?
            <Tooltip title="Если вы хотите предлагать свои мероприятия, то поставьте галочку" placement="right-start">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Хотите стать организатором?"
              />
            </Tooltip>
          : <></>
          }
          <Button
            type="button"
            fullWidth
            variant="contained"
            className={classes.submit}
            onClick={register}
          >
            {props.actionName}
          </Button>
        </form>
        {isError ? <ErrorBox isOpen={isError} message={errorMessage}/> : <></>}
        {showNotification ? <NotificationBox closeCallback={notificationBoxCallback} isNotify={showNotification} message={'Регистрация успешна'}/> : <></>}
      </div>
    </Container>
  );
}