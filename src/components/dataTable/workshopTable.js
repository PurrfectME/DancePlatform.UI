import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import shortid from 'shortid';
import RegistrationService from '../../services/registrationService';
import storageHelper from '../../helpers/storageHelper';
import WorkshopService from '../../services/workshopService';
import timeHelper from '../../helpers/dateHelper';
import {styles, categories} from '../../constants/commonData';
import UsersAdditionalInfo from './usersAdditionalInfo';
import ErrorBox from '../dialog/errorBox.js';
import '../../styles/workshopTable.css'
import Popup from '../dialog/popup';

const headCells = storageHelper.isOrganizer() && window.location.pathname.split("/")[1] !== "users-accounting" ? [
    { id: 'place', numeric: false,  label: 'Место' },
    { id: 'date', date: true,  label: 'Дата' },
    { id: 'time', date: true,  label: 'Время' },
    { id: 'choreographer', numeric: false, label: 'Хореограф' },
    { id: 'style', numeric: false, label: 'Стиль' },
    { id: 'category', numeric: false, label: 'Уровень' },
    { id: 'price', numeric: true, label: 'Цена, RUB' },
    { id: 'minAge', numeric: false, label: 'Мин. возраст' },
    { id: 'currentUsersCount', numeric: false, label: 'Зарег. людей' },
    { id: 'comment', numeric: false, label: 'Комментарий' },
] : storageHelper.isOrganizer() && window.location.pathname.split("/")[1] === "users-accounting" ?
[
  { id: 'place', numeric: false,  label: 'Место' },
  { id: 'date', date: true,  label: 'Дата' },
  { id: 'time', date: true,  label: 'Время' },
  { id: 'choreographer', numeric: false, label: 'Хореограф' },
  { id: 'style', numeric: false, label: 'Стиль' },
  { id: 'category', numeric: false, label: 'Уровень' },
  { id: 'price', numeric: true, label: 'Цена, RUB' },
  { id: 'minAge', numeric: false, label: 'Мин. возраст' },
  { id: 'maxUsers', numeric: false, label: 'Макс. людей' },
]
:
[
  { id: 'place', numeric: false,  label: 'Место' },
  { id: 'date', date: true,  label: 'Дата' },
  { id: 'time', date: true,  label: 'Время' },
  { id: 'choreographer', numeric: false, label: 'Хореограф' },
  { id: 'style', numeric: false, label: 'Стиль' },
  { id: 'category', numeric: false, label: 'Уровень' },
  { id: 'price', numeric: true, label: 'Цена, RUB' },
];
  
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
      {storageHelper.isOrganizer() && window.location.pathname.split("/")[1] !== "workshops-history" ?
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
      :
        <></>
      }
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === 'name' ? 'left' : 'right'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: '#f7b692',
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: '#f7b692',
        },
  title: {
    flex: '1 1 100%',
    color: 'black',
  }
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  btn: {
    color: 'black',
    backgroundColor: '#B2C8D6',
    "&:hover": {
      backgroundColor: '#F59B69',
    },
    width: 720,
    marginLeft: 30
},
rowsInfo: {
  display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    maxWidth: 1198,
    margin: 'auto',
    height: 200,
    alignItems: 'center',
    fontSize: 35
},
}));

export default function WorkshopTable(props) {
  let history = useHistory();
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [isOpenAdditionalInfo, setIsOpenAdditionalInfo] = useState(false);
  const [workshopIdToPreview, setWorkshopIdToPreview] = useState(-1);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCloseButtonDisabled, setIsCloseButtonDisabled] = useState(true);
  const date = timeHelper.normalizeDate(new Date());

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
      if(props.workshopId){
        WorkshopService.getById(props.workshopId).then(response => {
          setRows([response])
        })
        .catch(err => {
          if(err.status == 401){
              localStorage.removeItem('token');
              history.push('/login')
          }
      });
        return;
      }

      if(props.isHistory){
        WorkshopService.getClosed(storageHelper.getCurrentUserId()).then(response => {
          setRows([...response]);
        })
        .catch(err => {
          if(err.status == 401){
              localStorage.removeItem('token');
              history.push('/login')
          }
      });
        return;
      }

      if(props.isUserOwnHistory){
        RegistrationService.getUserVisitedWorkshops(storageHelper.getCurrentUserId()).then(response => {
          setRows([...response]);
        })
        .catch(err => {
          if(err.status == 401){
              localStorage.removeItem('token');
              history.push('/login')
          }
      });
        return;
      }

      if((rows.length === 0 && !props.fromWorkshops)){
        WorkshopService.getAllForUsersAccounting(storageHelper.getCurrentUserId()).then(workshops => {

        RegistrationService.getAllRegistrations().then(registrations => {
            if(registrations.length === 0){
                setRows([...workshops]);
            }
            else{
                setRows([...workshops.filter(x => !registrations.some(y => x.id === y.workshopId && y.userId === storageHelper.getCurrentUserId()))]);
            }
        }).catch(err => {
          if(err.status == 401){
              localStorage.removeItem('token');
              history.push('/login')
          }
      })
        });
    }
    else if(rows.length === 0 && props.fromWorkshops){
        RegistrationService.getUserWorkshops(storageHelper.getCurrentUserId()).then(x => {
            setRows([...x]);
        }).catch(err => {
          if(err.status == 401){
              localStorage.removeItem('token');
              history.push('/login')
          }
      });
    }
  }, [])


  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    setIsCloseButtonDisabled(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const numSelected = selected.length;

  const toolBarStyles = useToolbarStyles();

  const currentWorkshop = rows.find(x => x.id === selected[0]);

  console.log('SELECT', currentWorkshop)

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
      {rows.length ?
      <>
      <Toolbar
      className={clsx(toolBarStyles.root, {
        [toolBarStyles.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={toolBarStyles.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} выбрано
        </Typography>
      ) : (
        !props.isHistory && !props.isUserOwnHistory ?
        <Typography className={toolBarStyles.title} variant="h4" id="tableTitle" component="div">
          Мастер-классы
        </Typography>
        :
        <Typography className={toolBarStyles.title} variant="h4" id="tableTitle" component="div">
          История мастер-классов
        </Typography>
      )}

      {props.isOrganizer ? (
        props.isHistory ? <></> :
        <>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={`${toolBarStyles.submit} ${classes.btn}`}
            onClick={() => {
                if(selected.length === 1){
                    setWorkshopIdToPreview(selected[0]);
                    setIsOpenAdditionalInfo(!isOpenAdditionalInfo);
                }
                else{
                    setErrorMessage('Просмотреть информацию можно лишь под одному классу за раз');
                    setIsError(true);
                }
            }}
            >
                Просмотреть дополнительно
            </Button>
            <Button
              disabled={isCloseButtonDisabled}
              type="button"
              variant="contained"
              color="primary"
              className={`${toolBarStyles.submit} ${classes.btn}`}
              onClick={() => {
                  if(selected.length !== 0){
                    setSelected([]);
                    setIsOpenAdditionalInfo(false);
                    setIsCloseButtonDisabled(true);
                  }
              }}
              >
              Сбросить выбранное
            </Button>
            <Button
              disabled={!currentWorkshop ? true : (currentWorkshop.date > date && timeHelper.isBeforeWithAddDays(currentWorkshop.date, date, 1)) ? false : true}
              // props.selectedWorkshop.date > date && timeHelper.isBeforeWithAddDays(props.selectedWorkshop.date, date, 1)
              type="button"
              variant="contained"
              color="primary"
              className={`${toolBarStyles.submit} ${classes.btn}`}
              onClick={() => {
                  if(selected.length !== 0){
                    setIsOpenAdditionalInfo(false);
                    setIsCloseButtonDisabled(true);
                    
                    const data = rows.find(x => x.id === selected[0]);
                    data.isClosed = true;
                    WorkshopService.editWorkshop(data).then(response => {
                      setRows([...rows.filter(x => x.id !== selected[0])]);
                      setSelected([]);
                    });

                  }
              }}
              >
              Завершить мастер-класс
            </Button>
        </>
      ) : props.fromWorkshops ? (
        <></>

      ) : props.isUserOwnHistory ? <></> :(
          
        <Tooltip title="Регистрация">
            <Button
                type="button"
                variant="contained"
                color="primary"
                className={toolBarStyles.submit}
                onClick={() => {
                    RegistrationService.registerOnWorkshop(
                    {
                        userId: storageHelper.getCurrentUserId(),
                        workshopIds: selected
                    }).then(x => {
                        WorkshopService.getAllWorkshops().then(workshops => {

                            RegistrationService.getAllRegistrations().then(registrations => {
                                if(registrations.length === 0){
                                    setRows([...workshops]);
                                }
                                else{
                                    setRows([...workshops.filter(x => !registrations.some(y => x.id === y.workshopId && y.userId === storageHelper.getCurrentUserId()))]);
                                }
                                setSelected([]);

                            })
                        });
                    })
                }}
                >
                Записаться
            </Button>
        </Tooltip>
      )}
    </Toolbar>

        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={shortid.generate()}
                      selected={isItemSelected}
                    >
                      {storageHelper.isOrganizer() && window.location.pathname.split("/")[1] !== "workshops-history" ?
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                      :
                        <></>
                      }
                      
                      <TableCell id={labelId} align="right" scope="row">
                        {row.place.studioName}
                      </TableCell>
                      <TableCell align="right">{timeHelper.normalizeDate(row.date)}</TableCell>
                      <TableCell align="right">{timeHelper.normalizeTime(row.time)}</TableCell>
                      <TableCell align="right">{row.choreographer.name}</TableCell>
                      <TableCell align="right">{styles[row.style]}</TableCell>
                      <TableCell align="right">{categories[row.category]}</TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                      {storageHelper.isOrganizer() && window.location.pathname.split("/")[1] !== "users-accounting" ? 
                        <>
                          <TableCell align="right">{row.minAge}</TableCell>
                          <TableCell align="right">{row.currentUsersCount}</TableCell>
                          <TableCell align="right"><textarea type="text">{row.comment}</textarea></TableCell>
                        </>
                        : storageHelper.isOrganizer() && window.location.pathname.split("/")[1] === "users-accounting" ?
                        <>
                          <TableCell align="right">{row.minAge}</TableCell>
                          <TableCell align="right">{row.maxUsers}</TableCell>
                        </>
                        :
                        <></>
                      }
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </>
        :
        <div className={classes.rowsInfo}><h1>НЕТ ДОСТУПНЫХ МАСТЕР-КЛАССОВ</h1></div>
        }
      </Paper>

    {isError ? <ErrorBox isOpen={isError} message={errorMessage}/> : <></>}
    {isOpenAdditionalInfo ? <UsersAdditionalInfo selectedWorkshop={currentWorkshop} workshopId={workshopIdToPreview}/> : <></>}

    {currentWorkshop && currentWorkshop.comment ? 
    <Popup content={
      <>
        <Paper style={{padding: 25}}>
          <Typography style={{fontSize: 25}}>Комментарий модератора</Typography>
          <Grid style={{padding: 45}} container item>
            <Typography>{currentWorkshop.comment}</Typography>
          </Grid>
          <Grid container item>
            <Button className={classes.btn} style={{marginLeft: 0, width: 300, margin: 'auto'}} onClick={() => {setSelected([])}}>Закрыть</Button>
          </Grid>
        </Paper>
      </>
    }/>
    :
    <></>
    }
    </div>
  );
}