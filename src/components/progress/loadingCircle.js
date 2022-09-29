import {React} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function LoadingCircle() {
    const classes = useStyles();
  
    return (
      <>
      КАРТА
      <div className={classes.root}>
        <CircularProgress />
      </div>
      </>
    );
  }