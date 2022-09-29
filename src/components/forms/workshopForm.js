import React, {  useState } from 'react';
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
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker,
} from '@material-ui/pickers';
import WorkshopService from '../../services/workshopService';
import ruLocale from "date-fns/locale/ru";
import ErrorBox from '../dialog/errorBox';
import moment from 'moment';
import timeHelper from '../../helpers/dateHelper';
import ImageUploading from 'react-images-uploading';
import '../../styles/profileInfo.css';
import Popup from '../dialog/popup';

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
      value={value === '' ? null : value}
      placeholder="dd/MM/yyyy"
      cancelLabel="Закрыть"
      mask="__/__/____"
      disablePast={true}
    />
  );
}

function TimePickerWrapper(props) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props;
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched;

  return (
    <TimePicker
      {...rest}
      ampm={false}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value === '' ? null : value}
    />
  );
}


const validate = values => {
  const errors = {};
  if (!values.studioName) {
    errors.studioName = 'Обязательно';
  }
  if (!values.date) {
    errors.date = 'Обязательно';
  }
  if (!values.time) {
    errors.time = 'Обязательно';
  }
  if (!values.style) {
    errors.style = 'Обязательно';
  }
  if (!values.category) {
    errors.category = 'Обязательно';
  }
  if (!values.choreographerName) {
    errors.choreographerName = 'Обязательно';
  }
  if (!values.price) {
    errors.price = 'Обязательно';
  }
  if (values.price <= 0) {
    errors.price = 'Некорректное значение';
  }
  if (!values.minAge) {
    errors.minAge = 'Обязательно';
  }
  if (values.minAge <= 0) {
    errors.minAge = 'Некорректное значение';
  }
  if (!values.maxUsers) {
    errors.maxUsers = 'Обязательно';
  }
  if (values.maxUsers <= 0) {
    errors.maxUsers = 'Некорректное значение';
  }
  if (!values.photoName) {
    errors.photoName = 'Обязательно';
  }
  return errors;
};

const useStyles = makeStyles((theme) => ({
  photoContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  photoFieldContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  btn: {
    color: 'black',
    backgroundColor: '#B2C8D6',
    "&:hover": {
      backgroundColor: '#F59B69',
    }
},
}));


export default function WorkshopForm(props) {
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageName, setImageName] = useState('');
  const [images, setImages] = useState([]);

  const onSubmit = values => {
    var today = moment();
    if(images.length !== 0){
      values.photo = images[0].base64Img
    }

    values.placeId = props.places.find(x => x.studioName === values.studioName).id;
    values.choreographerId = props.choreographers.find(x => x.name === values.choreographerName).id;

    if(!props.editing){
        if(timeHelper.normalizeDate(today) > timeHelper.normalizeDate(values.date)){
          setError(true);
          setErrorMessage('Некорректная дата');
          return;
        }
        if(timeHelper.normalizeDate(today) === timeHelper.normalizeDate(values.date) &&
                timeHelper.normalizeTime(today) > timeHelper.normalizeTime(values.time)){
          setError(true);
          setErrorMessage('Некорректное время');
          return;
        }
        
        WorkshopService.createWorkshop(values).then(response => {
          props.showFormCallback(props.showForm, response.data);
        });
    }
    else{
      if(timeHelper.normalizeDate(today) === timeHelper.normalizeDate(values.date) &&
                timeHelper.normalizeTime(today) > timeHelper.normalizeTime(values.time)){
          setError(true);
          setErrorMessage('Некорректное время');
          return;
        }
        WorkshopService.editWorkshop(values).then(response => {
          props.showFormCallback(props.showForm, response.data, props.editing);
        })
    }
  };

  let stylesData = [];
  let categoriesData = [];
  let placesData = [];
  let choreographersData = [];
  let i = 0;

  for (const [key, value] of Object.entries(props.styles)) {
      stylesData.push(
          <MenuItem key={i++} value={key}>{value}</MenuItem>
      )
  }
  for (const [key, value] of Object.entries(props.categories)) {
      categoriesData.push(
        <MenuItem key={i++} value={key}>{value}</MenuItem>
      )
  }
  for (const x of props.places) {
    placesData.push(
      <MenuItem key={x.id} value={x.studioName}>{x.studioName}</MenuItem>
    )
  }
  for (const x of props.choreographers) {
    choreographersData.push(
      <MenuItem key={x.id} value={x.name}>{x.name}</MenuItem>
    )
  }

  const errorCallback = error => {
    setError(error);
  }

  const onCloseClick = () => {
    props.showFormCallback(props.showForm, null, props.editing)
  }

  const onChange = (imageList, addedIndex) => {
    setImageName(imageList[0].file.name);
    setImages(imageList);
  }

  return(
    props.showForm ?

      <Popup content={
        <>
          <div style={{margin: 'auto', maxWidth: 700 }}>
          {error ? <ErrorBox callback={errorCallback} isOpen={error} message={errorMessage}/> : <></>}
        <CssBaseline />
        <Form
          onSubmit={onSubmit}
          initialValues={props.initialData}
          validate={validate}
          render={({ handleSubmit, reset, submitting, pristine, values, form }) => (
            <form onSubmit={handleSubmit}>
              <Paper style={{ padding: 16, width: 676 }}>
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={4}>
                    <Field
                      name="studioName"
                      component={Select}
                      label="Место *"
                      type="text"
                      formControlProps={{ fullWidth: true}}
                    >
                      {placesData}
                    </Field>
                  </Grid>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                    <Grid item xs={4}>
                      <Field
                      fullWidth
                      required
                      name="date"
                      component={DatePickerWrapper}
                      type="text"
                      label="Дата"
                    />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item xs={4}>
                      <Field
                        fullWidth
                        required
                        name="time"
                        component={TimePickerWrapper}
                        type="text"
                        label="Время"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name="style"
                      component={Select}
                      label="Выберите стиль *"
                      formControlProps={{ fullWidth: true}}
                    >
                      {stylesData}
                    </Field>
                  </Grid>
                  <Grid item xs={3} >
                      <Field
                        name="photoName"
                        component={TextField}
                        type="text"
                        label={'Фото'}
                      ></Field>
                      
                  </Grid>
                  <Grid style={{display: 'flex', alignItems: 'flex-end', height: 61}} item xs={3} >
                    <ImageUploading
                      value={images}
                      onChange={(imageList, a) => {
                        onChange(imageList, a);
                        form.change('photoName', imageList[0].file.name);
                      }
                      }
                      dataURLKey="base64Img"
                      acceptType={['jpg']}
                    >
                      {({
                      onImageUpload,
                      
                      isDragging,
                      dragProps,
                      }) => (
                      // write your building UI
                          <Button
                                className={classes.btn}
                                type="button" variant="contained" color="primary"
                                style={isDragging ? { color: 'red' } : undefined}
                                onClick={onImageUpload}
                                {...dragProps}
                                >
                            Добавить фото
                          </Button>
                      )}
                    </ImageUploading>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      fullWidth
                      name="category"
                      component={Select}
                      label="Выберите категорию *"
                      formControlProps={{ fullWidth: true }}
                    >
                      {categoriesData}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      fullWidth
                      name="choreographerName"
                      component={Select}
                      label="Выберите хореографа"
                      formControlProps={{ fullWidth: true }}
                    >
                      {choreographersData}
                    </Field>
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name="price"
                      component={TextField}
                      type="number"
                      label="Цена"
                      formControlProps={{ fullWidth: true, required: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name="maxUsers"
                      component={TextField}
                      type="number"
                      label="Максимальное количество участников"
                      formControlProps={{ fullWidth: true, required: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      name="minAge"
                      component={TextField}
                      type="number"
                      label="Минимальный возраст"
                      formControlProps={{ fullWidth: true, required: true }}
                    />
                  </Grid>
                  <Grid item style={{ marginTop: 16 }}>
                    {props.editing ? 
                    <>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting}
                      className={classes.btn}
                      style={{marginRight: 25}}
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
                      className={classes.btn}
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
                        style={{marginRight: 25}}
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

