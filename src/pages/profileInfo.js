import {React, useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import {
    Paper,
    Grid,
    Button,
    CssBaseline,
    MenuItem,
    TextField,
    makeStyles,
    Typography
  } from '@material-ui/core';
import ImageUploading from 'react-images-uploading';
import '../styles/profileInfo.css'
import defaultUpload from '../images/defaultUpload.png';
import ProfileService from '../services/profileService';
import storageHelper from '../helpers/storageHelper';
import timeHelper from '../helpers/dateHelper';
import ProfileForm from '../components/forms/profileForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImage } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'start',
      maxWidth: 1198,
      margin: 'auto',
      
    },
    grid: {
        flexDirection: 'row',
        padding: 55,
        height: 510,
    },
    generalInfo: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 30,
        width: 445,
        justifyContent: 'space-between'
    },
    img: {
        display: 'block',
        marginRight: 43,
        minWidth: 300,
        minHeight: 300,
        backgroundPosition: 'center', 
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat',
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
    },
    userName: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    fullName: {
        fontSize: 15,
        marginBottom: 10,
    },
    personalInfoTab: {
        display: 'inline-block'
    },
    imageButtons: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: 'black',
        backgroundColor: '#B2C8D6',
        "&:hover": {
          backgroundColor: '#F59B69',
        }
    },
    dob: {
        marginBottom: 10,
    }
}));

export default function ProfileInfo(){
    const classes = useStyles();
    let history = useHistory();
    const [images, setImages] = useState([]);
    const [defaultImg, setDefaultImg] = useState([]);
    const [user, setUser] = useState(storageHelper.getCurrentUser());
    const [editing, setEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        ProfileService.getImage().then(response => {
            const xhr = new XMLHttpRequest();       
            xhr.open("GET", defaultUpload); 
            xhr.responseType = "blob";
            xhr.onload = (e) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                const res = event.target.result;
                setDefaultImg([{base64Img: res}]);
                }

                const file = xhr.response;
                reader.readAsDataURL(file)
            };
            xhr.send();
            if(response){
                setImages([{base64Img: `data:image/jpg;base64,${response}`}]);
                return;
            }
        }).catch(err => {
            if(err.status == 401){
                localStorage.removeItem('token');
                history.push('/login')
            }
        });;
    }, [])

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        if(imageList.length){
            ProfileService.uploadImage(imageList[0]).then(x => {
                setImages(imageList);
            });
            return;
        }

        ProfileService.deleteImage().then(x => {
            setImages([]);
        });
    };

    const editHandle = () => {
        setEditing(true);
    }

    const updateHandle = () => {
        setEditing(false);
    }

    const showFormCallback = (show, user, editing) => {
        setEditing(false);
        setShowForm(false);

        setUser(user);
    }

    return(
        <>
            <Paper style={{height: 560}}>
                <Grid className={classes.grid} container>
                <Grid className={classes.img} item>
                    <ImageUploading
                        value={images}
                        onChange={onChange}
                        dataURLKey="base64Img"
                        acceptType={['jpg']}
                    >
                        {({
                        imageList,
                        onImageUpload,
                        onImageRemove,
                        isDragging,
                        dragProps,
                        }) => (
                        // write your building UI
                        <Grid container item>
                        <div className="upload__image-wrapper">
                            {images.length !== 0 ? <></> :
                                defaultImg.length === 0 ? <></> :
                                <img src={defaultImg[0].base64Img} alt="" width="300" height="300"/>
                            }
                            {imageList.map((image, index) => (
                            <div key={index} className="profile-image-item">
                                <img src={image['base64Img']} alt="" width="300" height="300" />
                            </div>
                            ))}
                            <div className={classes.imageButtons}>
                                <Button
                                className={classes.submit}
                                type="button" variant="contained" color="primary"
                                style={isDragging ? { color: 'red' } : undefined}
                                onClick={onImageUpload}
                                {...dragProps}
                                >
                                    Загрузить
                                </Button>
                                <Button className={classes.submit} type="button" variant="contained" color="primary" onClick={onImageRemove}>Удалить</Button>
                            </div>
                        </div>
                        </Grid>
                        )}
                    </ImageUploading>
                </Grid>
                <Grid item>
                    {editing ? 
                    <ProfileForm
                        showForm={true}
                        editing={editing}
                        initialData={editing ? user : {}}
                        showFormCallback={showFormCallback}
                    />
                    :
                    <>
                        <Typography style={{marginBottom: 0}} className={classes.userName}>
                            Логин: {user.userName}
                        </Typography>
                        <Typography className={classes.userName}>
                            E-mail: {user.email}
                        </Typography>
                        <Typography className={classes.fullName}>
                            Имя: {user.name}
                        </Typography>
                        <Typography className={classes.fullName}>
                            Фамилия: {user.surname}
                        </Typography>
                        <Typography className={classes.dob}>
                            Возраст: {new Date().getFullYear() - new Date(timeHelper.normalizeDate(user.dateOfBirth)).getFullYear()}
                        </Typography>
                        <Typography className={classes.dob}>
                            Телефон: {user.phoneNumber}
                        </Typography>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            className={classes.submit}
                            onClick={editHandle}
                        >
                            Редактировать
                        </Button>
                    </>
                    }
                </Grid>
                </Grid>
            </Paper>
        </>
    );
};