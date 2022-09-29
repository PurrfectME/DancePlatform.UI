import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { TextField, Select } from 'final-form-material-ui';
import {
  Paper,
  Grid,
  Button,
  CssBaseline,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import ErrorBox from '../dialog/errorBox';
import PlaceService from '../../services/placeService';
import Popup from '../dialog/popup';
import storageHelper from '../../helpers/storageHelper';

const validate = values => {
  const errors = {};
  if (!values.studioName) {
    errors.place = 'Обязательно';
  }
  if (!values.address) {
    errors.date = 'Обязательно';
  }
  
  return errors;
};

const useStyles = makeStyles((theme) => ({
  btn: {
    color: 'black',
    backgroundColor: '#B2C8D6',
    "&:hover": {
      backgroundColor: '#F59B69',
    }
},
}));


export default function PlaceForm(props) {
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = values => {
    
    if(!props.editing){
        values.createdBy = storageHelper.getCurrentUserId();
        PlaceService.createPlace(values).then(response => props.showFormCallback(props.showForm, response));
    }
    else{
        PlaceService.updatePlace(values).then(response => props.showFormCallback(props.showForm, response, props.editing))
    }
  };

  const errorCallback = error => {
    setError(error);
  }

  const onCloseClick = () => {
    props.showFormCallback(props.showForm, null, props.editing)
  }


  return(
    props.showForm ?
    <Popup content={
      <>
    <div style={{margin: 'auto', maxWidth: 700 }}>
        {error ? <ErrorBox callback={errorCallback} isError={error} message={errorMessage}/> : <></>}
      <CssBaseline />
      <Form
        onSubmit={onSubmit}
        initialValues={props.initialData}
        validate={validate}
        render={({ handleSubmit, reset, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Paper style={{ padding: 16 }}>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={6}>
                  <Field
                    fullWidth
                    required
                    name="studioName"
                    component={TextField}
                    type="text"
                    label="Студия"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    fullWidth
                    name="address"
                    component={TextField}
                    label="Адрес"
                  />
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  {props.editing ? 
                  <>
                  <Button
                    style={{marginRight: 25}}
                    className={classes.btn}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    Сохранить
                  </Button>
                  <Button
                    className={classes.btn}
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={onCloseClick}
                    disabled={submitting}
                  >
                    Закрыть
                  </Button>
                  </>
                  :
                  <>
                    <Button
                      style={{marginRight: 25}}
                      className={classes.btn}
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting}
                    >
                      Добавить
                    </Button>
                    <Button
                      className={classes.btn}
                      variant="contained"
                      color="primary"
                      type="button"
                      onClick={onCloseClick}
                      disabled={submitting}
                  >
                    Закрыть
                  </Button>
                  </>}
                </Grid>
              </Grid>
            </Paper>
          </form>
          
        )}


      />

    </div>
      </>
    }
    />
    :
    <></>
    );
}

