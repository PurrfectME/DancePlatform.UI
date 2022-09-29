import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import storageHelper from '../../helpers/storageHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserAlt } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiButton-label": {
      color: 'white',
      textDecoration: 'none',
    },
    "& .MuiTypography-root": {
      color: 'black',
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontFamily: 'Pacifico',

    flexGrow: 1,
  },
  menu: {
    display: 'flex !important',
  }
}));

export default function Header(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);


  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  
  return (
    <div className={`${classes.root} p`}>
      <AppBar position="static">
        <Toolbar>
          <>
            <Typography variant="h6" style={{fontFamily: 'Pacifico', color: 'white'}}>
              <Link to="/">DanceEvents</Link>
            </Typography>
            <Typography variant="h6" className={classes.title}>
                
                {props.isOrganizer ? 
                <>
                  {/* <Button style={{textDecoration: 'none', color: 'white'}} aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenu}>
                    Дополнительные действия
                  </Button> */}
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>
                      <Button href='/' color="inherit">
                        Все мастер-классы
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button href='/users-accounting' color="inherit">
                          Учёт пользователей
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Button href='/places' color="inherit">
                          Управление студиями
                        </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Button href='/choreographers' color="inherit">
                        Управление хореографами
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Button href='/events' color="inherit">
                          Календарь событий
                        </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Button href='/workshops-history' color="inherit">
                          История мастер-классов
                        </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Button href='/login' onClick={() => {
                        localStorage.clear();
                      }} color="inherit">
                          Выйти
                      </Button>
                    </MenuItem>
                  </Menu>
                </>
                :
                  
                  storageHelper.isModerator() ?
                  
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>
                      <Button href='/' color="inherit">
                        Ожидают подтверждения
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Button href='/login' onClick={() => {
                        localStorage.clear();
                      }} color="inherit">
                          Выйти
                      </Button>
                    </MenuItem>
                  </Menu>
                :
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>
                      <Button href='/' color="inherit">
                        Все мастер-классы
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Button href='/workshops' color="inherit">
                          Мои мастер-классы
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Button href='/desired-workshops' color="inherit">
                        Желаемые мастер-классы
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Button href='/user-workshops-history' color="inherit">
                          История
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Button href='/profile-info' color="inherit">
                        Личный кабинет
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Button href='/login' onClick={() => {
                        localStorage.clear();
                      }} color="inherit">
                          Выйти
                      </Button>
                    </MenuItem>
                </Menu>
                }
            </Typography>
          </>
            {props.isAuthenticated ? 
              <>
              <Button className={classes.menu} aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenu}>
                <p>
                  {storageHelper.getCurrentUserName()}
                </p>
                <FontAwesomeIcon icon={faUserAlt} size="2x" pull="right" color="white"/>
              </Button>
              </>
            :
            <>
            <Link to="/login">
                <Button color="inherit">
                    Войти
                </Button>
            </Link>
            <Link to="/register">
                <Button color="inherit">
                    Регистрация
                </Button>
            </Link>
            </>}
            
        </Toolbar>
      </AppBar>
    </div>
  );
}