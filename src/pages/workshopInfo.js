import {React, useEffect, useState} from 'react';
import WorkshopService from '../services/workshopService';
import { makeStyles } from '@material-ui/core/styles';
import {Paper, Grid, Typography, Button} from '@material-ui/core';
import _ from 'lodash';
import YMap from '../components/maps/YMap';
import RegistrationService from '../services/registrationService';
import {categories, styles} from '../constants/commonData';
import ImageUploading from 'react-images-uploading';
import Link from '@material-ui/core/Link';
import '../styles/profileInfo.css'
import PayPalComponent from '../components/paypal/paypalComponent';
import storageHelper from '../helpers/storageHelper';
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import Popup from '../components/dialog/popup';
import { Form, Field } from 'react-final-form';
import { TextField, Select, Input } from 'final-form-material-ui';
import timeHelper from '../helpers/dateHelper';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      flexWrap: 'wrap',
      maxWidth: 1198,
      margin: 'auto',
    },
    paper: {
        margin: '0 auto',
        maxWidth: 1150,
        marginTop: 50
    },
    grid: {
    },
    gridInfo: {
        flexDirection: 'inherit',
        alignItems: 'start',
        alignContent: 'flex-start',
        marginTop: 0,
        marginBottom: 10,
        flexDirection: 'column',
        marginLeft: 60,
        justifyContent: 'space-evenly'
    },
    img: {
    },
    registerButton: {
        marginBottom: 5,
        marginTop: 5,
    },
    moderatorButtons: {
        marginTop: 45,
        display: 'flex',
        justifyContent: 'space-evenly',
        width: 770,
        paddingBottom: 45
    },
    btn: {
        marginTop: 15,
        color: 'black',
        backgroundColor: '#B2C8D6',
        "&:hover": {
          backgroundColor: '#F59B69',
        },
        fontSize: 20
    },
    chroreoContainer: {
        marginBottom: 50,
    },
    btnsGrid: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 35
    }
}));

const validate = values => {
    const errors = {};
    if (!values.comment) {
      errors.comment = 'Обязательно';
    }

    return errors;
}

export default function WorkshopInfo(){
    let history = useHistory();
    const classes = useStyles();
    const [workshop, setWorkshop] = useState({
        minAge: 0,
        maxUsers: 0,
        choreographer: {
            name: '',
            description: '',
        },
        place: {
            address: '',
        }
    });

    const [showPopup, setShowPopup] = useState(false);
    
    const [isDesired] = useState(new URLSearchParams(window.location.search).get('desired'));

    useEffect(() => {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length-1];
        WorkshopService.getById(id).then(response => {
            response.photo = `data:image/jpg;base64,${response.photo}`;
            setWorkshop(response);
        });
    }, []);

    const addToDesired = () => {
        const registration = {
            workshopId: workshop.id,
            userId: storageHelper.getCurrentUserId(),
            isDesired: true,
            isPaid: false
          };
        RegistrationService.registerOnWorkshop(registration).then(response => {
            history.push('/');
        })
    }

    const declineWorkshop = (values) => {
        WorkshopService.declineWorkshop(workshop.id, values.comment).then(x => {
            history.push('/');
        });
    }

    return(
        <>
            <Paper className={classes.paper}>
                <Grid className={classes.grid} container>
                    <Grid container className={classes.chroreoContainer}>
                        <Grid className={classes.img} item xs={5}>
                            <ImageUploading
                                value={workshop.photo}
                                dataURLKey="photo"
                            >
                                {({
                                }) => (
                                // write your building UI
                                <Grid container>
                                    <div className="upload__image-wrapper">
                                        <div key={1} className="image-item">
                                            <img src={workshop['photo']} alt="" />
                                        </div>
                                    </div>
                                </Grid>
                                )}
                            </ImageUploading>
                        </Grid>
                        <Grid className={classes.gridInfo} item xs={6} container>
                            
                            <Grid item style={{display: 'flex', flexDirection: 'column'}}>
                                <Typography variant="h5">Мастер-класс</Typography>
                                <Typography variant="h2">{styles[workshop.style]}&#160;({categories[workshop.category]})</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4">Хореограф: {workshop.choreographer.name}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">Возраст: {new Date().getFullYear() - new Date(workshop.choreographer.dateOfBirth).getFullYear()}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6">{workshop.choreographer.description}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" style={{display: 'inline'}}>Соцсеть:</Typography>
                                &#160;&#160;
                                <Link variant="h5" color="inherit" href={`${workshop.choreographer.link}`}>
                                    <FontAwesomeIcon icon={faInstagram} />
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid xs={5} item >
                            <YMap address={workshop.place.address}/>
                        </Grid>

                        <Grid className={classes.gridInfo} item xs={6} container>
                            <Grid item>
                                <Typography variant="h5">Стоимость: {workshop.price} RUB</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">Место проведения: {workshop.place.address} ({workshop.place.studioName})</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">Дата: {timeHelper.normalizeDate(workshop.date)} {timeHelper.normalizeTime(workshop.time)}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">Возрастное ограничение: {workshop.minAge}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">Количество мест: {workshop.maxUsers}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">Количество свободных мест: {workshop.maxUsers - workshop.currentUsersCount}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                      <Grid className={classes.btnsGrid} item container xs={12}>
                        {storageHelper.isModerator() ?
                            <div className={classes.moderatorButtons}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    color="primary"
                                    className={classes.btn}
                                    onClick={() => {
                                        WorkshopService.approveWorkshop(workshop.id).then(x => {
                                            history.push('/');
                                        });
                                    }}
                                >
                                    Подтвердить мастер-класс
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    color="primary"
                                    className={classes.btn}
                                    onClick={() => setShowPopup(true)}
                                >
                                    Отклонить мастер-класс
                                </Button>
                            </div>
                        :
                        <>
                            {isDesired == 'false' ?
                            <>
                                <Button style={{height: 55, width: 500, marginTop: 35}} onClick={addToDesired} className={`${classes.registerButton} ${classes.btn}`} type="button" variant="contained" color="primary">
                                    Добавить в желаемое 
                                </Button>
                                <h1 style={{fontSize: 20, marginTop: 20}}>Или</h1>
                            </>
                        :
                            <></>
                        }
                            {workshop.maxUsers === workshop.currentUsersCount ? <></> :
                                <button style={{width: 500, marginTop: 20}} className={classes.registerButton} type="button" variant="contained" color="primary">
                                    <PayPalComponent workshop={workshop}/>
                                </button>
                        }
                        </>
                        }
                        </Grid>
                </Grid>
            </Paper>
            {showPopup ? 
                <Popup content={
                    <>
                        <Form
                            onSubmit={declineWorkshop}
                            initialValues={''}
                            validate={validate}
                            render={({ handleSubmit, reset, submitting, pristine, values }) => (
                                <form onSubmit={handleSubmit}>
                                     <Paper style={{padding: 15}}>
                                         {/* <h1>КОММЕНТАРИЙ</h1> */}
                                        <Grid container item xs={12}>
                                        <Field
                                            fullWidth
                                            name="comment"
                                            component={TextField}
                                            label="Коментарий *"
                                            type="text"
                                        />
                                        </Grid>
                                        <Button variant="contained"
                                            type="submit"
                                            style={{marginRight: 25}}
                                            className={classes.btn} disabled={submitting} type="submit">Отклонить</Button>
                                        <Button variant="contained"
                                            color="primary"
                                            type="submit"
                                            className={classes.btn}
                                            disabled={submitting} onClick={() => setShowPopup(false)}>Закрыть</Button>
                                    </Paper>
                                </form>)
                            }
                        />
                    </>
                }/>
            :
                <></>
            }
            
        </>
    );
}