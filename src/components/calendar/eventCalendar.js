import {React, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {
    MonthlyBody,
    MonthlyCalendar,
    useMonthlyCalendar,
    DefaultMonthlyEventItem,
  } from '@zach.codes/react-calendar';
  import {
    startOfMonth,
    parseISO,
    format
  } from 'date-fns';
import '@zach.codes/react-calendar/dist/calendar-tailwind.css';
import MonthlyNav from './monthlyNav.js';
import { Button } from '@material-ui/core';
import WorkshopService from '../../services/workshopService';
import timeHelper from '../../helpers/dateHelper';
import { makeStyles } from '@material-ui/core/styles';
import '../../styles/profileInfo.css'
import { Paper } from '@material-ui/core';
import storageHelper from '../../helpers/storageHelper.js';

const useStyles = makeStyles((theme) => ({
  btn: {
    boxShadow: 'inset 0 0 10px rgb(47 66 146 / 50%)',
    borderRadius: 30,
    width: '-webkit-fill-available',
    color: 'black',
    marginBottom: 5,
    "&:hover": {
      backgroundColor: 'rgb(47 66 146 / 20%)'
    }
  },
}));


export default function EventCalendar() {
  const classes = useStyles();
  let history = useHistory();
  let [currentMonth, setCurrentMonth] = useState(
    startOfMonth(new Date())
  );
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    WorkshopService.getAllWorkshops(storageHelper.getCurrentUserId()).then(response => {
      setWorkshops([...response]);
    }).catch(err => {
      if(err.status == 401){
          localStorage.removeItem('token');
          history.push('/login')
      }
  })
    
  }, []);

  return (
    <Paper style={{padding: 50}}>
      <MonthlyCalendar
        currentMonth={currentMonth}
        onCurrentMonthChange={date => setCurrentMonth(date)}
      >
        <MonthlyNav />
        <MonthlyBody
          events={[...workshops.map(x => {
            const date = parseISO(`${timeHelper.normalizeDate(x.date)}T${timeHelper.toUtc(x.time).substr(11, 5)}`);
            if(date < new Date()){
              return false;
            }
            if(!x.isApprovedByModerator || x.isClosed){
              return false;
            }
            return {
              title: x.place.studioName,
              date: date,
              id: x.id
            }
          })]}
          renderDay={data =>
            data.map((item, index) => (
              <Button color="primary" className={classes.btn} href={`/users-accounting/${item.id}`}>
                <DefaultMonthlyEventItem
                  key={item.id}
                  title={item.title}
                  date={`${item.date.toLocaleTimeString()}`}
              />
              </Button>
              
            ))
          }
        />
      </MonthlyCalendar>
    </Paper>
  );
};
