import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { TextField, Select } from 'final-form-material-ui';
import {
  Paper,
  Grid,
  Button,
  CssBaseline,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import ErrorBox from '../dialog/errorBox';
import ChoreographerService from '../../services/choreographerService';
import Popup from '../dialog/popup';
import storageHelper from '../../helpers/storageHelper';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker,
} from '@material-ui/pickers';
import ruLocale from "date-fns/locale/ru";

function DatePickerWrapper(props) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props;
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched;

  return (
    <DatePicker
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      format="dd/MM/yyyy"
      value={value === '' ? null : value}
      placeholder="dd/MM/yyyy"
      cancelLabel="Закрыть"
      mask="__/__/____"
      disableFuture={true}
    />
  );
}

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Обязательно';
  }
  if (!values.style) {
    errors.style = 'Обязательно';
  }
  if (!values.description) {
    errors.description = 'Обязательно';
  }
  if (!values.dateOfBirth) {
    errors.dateOfBirth = 'Обязательно';
  }
  if (!values.link) {
    errors.link = 'Обязательно';
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

export default function ChoreographerForm(props) {
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = values => {
    if(!props.editing){
        values.createdBy = storageHelper.getCurrentUserId();
        ChoreographerService.create(values).then(response => props.showFormCallback(props.showForm, response));
    }
    else{
        ChoreographerService.update(values).then(response => props.showFormCallback(props.showForm, response, props.editing))
    }
  };

  const errorCallback = error => {
    setError(error);
  }

  const onCloseClick = () => {
    props.showFormCallback(props.showForm, null, props.editing)
  }

  let stylesData = [];
  let i = 0;

  for (const [key, value] of Object.entries(props.styles)) {
    stylesData.push(
        <MenuItem key={i++} value={key}>{value}</MenuItem>
    )
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
                    name="name"
                    component={TextField}
                    type="text"
                    label="Имя"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    fullWidth
                    required
                    name="description"
                    component={TextField}
                    label="Описание"
                  />
                </Grid>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                    <Grid item xs={6}>
                      <Field
                        fullWidth
                        required
                        name="dateOfBirth"
                        type="text"
                        label="Дата"
                        component={DatePickerWrapper}
                    />
                    </Grid>
                  </MuiPickersUtilsProvider>
                <Grid item xs={6}>
                <Field
                    fullWidth
                    required
                    name="style"
                    component={Select}
                    label="Стиль *"
                    formControlProps={{ fullWidth: true}}
                  >
                    {stylesData}
                  </Field>
                </Grid>
                <Grid item xs={6}>
                  <Field
                    fullWidth
                    required
                    name="link"
                    component={TextField}
                    label="Соцсеть"
                  />
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  {props.editing ? 
                  <>
                  <Button
                    className={classes.btn}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                    style={{marginRight: 20}}
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
                      className={classes.btn}
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting}
                      style={{marginRight: 20}}
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

