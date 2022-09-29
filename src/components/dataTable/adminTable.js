import {React, useEffect, useState} from 'react';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import WorkshopForm from '../forms/workshopForm';
import WorkshopService from '../../services/workshopService';
import { categories, styles } from '../../constants/commonData';
import timeHelper from '../../helpers/dateHelper';
import storageHelper from '../../helpers/storageHelper';
import PlaceService from '../../services/placeService';
import ChoreographerService from '../../services/choreographerService';
import Typography from '@material-ui/core/Typography';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
      margin: 22,
    },
    btn: {
        color: 'black',
        backgroundColor: '#B2C8D6',
        "&:hover": {
          backgroundColor: '#F59B69',
        }
    },
}));

export default function AdminTable(props) {
    const classes = useStyles();
    let history = useHistory();

    const [showForm, setShowForm] = useState(false);
    const [workshops, setWorkshops] = useState([]);
    const [selectedRowToEdit, setSelectedRowToEdit] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [editing, setEditing] = useState(false);
    const [places, setPlaces] = useState([]);
    const [choreographers, setChoreographers] = useState([]);

    const columns = [
        {
            name: " ",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Button className={classes.btn} disabled={showForm || tableMeta.rowData[13] === 'Да'} onClick={() => 
                        {
                            setShowForm(!showForm);
                            setEditing(true);
                        }} type="button" variant="contained" color="primary">
                            Редактировать
                        </Button>
                    );
                }
                }
        },
        {
            name: " ",
            options: {
              filter: false,
              sort: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                    <Button className={classes.btn} disabled={showForm || tableMeta.rowData[13] === 'Да'} onClick={() => {
                        const idToDelete = workshops[tableMeta.rowIndex].id;

                        WorkshopService.deleteWorkshop(idToDelete).then(response => {
                            setWorkshops([...workshops.filter(x => x.id !== idToDelete)])
                        });
                        }} type="button" variant="contained" color="primary">
                        Удалить
                    </Button>
                );
              }
            }
        },
        { name: 'id', label: 'Номер' },
        { name: 'studioName', label: 'Место' },
        { name: 'date', label: 'Дата' },
        { name: 'time', label: 'Время' },
        { name: 'choreographerName', label: 'Хореограф' },
        { name: 'style', label: 'Стиль' },
        { name: 'category', label: 'Уровень' },
        { name: 'price', label: 'Цена, RUB' },
        { name: 'minAge', label: 'Мин. возраст' },
        { name: 'maxUsers', label: 'Макс. людей' },
        { name: 'currentUsersCount', label: 'Зарег. людей' },
        { name: 'isApprovedByModerator', label: 'Одобрено модератором' },
    ];

    const handleRowClick = (rowData, rowMeta) => {
        setSelectedRowToEdit(rowMeta.dataIndex);
        setSelectedStyle(rowData[7]);
        setSelectedCategory(rowData[8]);
    };

    const options = {
        filterType: 'dropdown',
        responsive: 'standard',
        viewColumns: false,
        print: false,
        onRowClick: handleRowClick,
        onDownload: (buildHead, buildBody, columns, data) => {
            return "\uFEFF" + buildHead(columns) + buildBody(data); 
        },
        selectableRows: 'none',
        textLabels: {
            body: {
              noMatch: "Извините, данных нет",
              toolTip: "Sort",
              columnHeaderTooltip: column => `Сортировать по ${column.label}`
            },
            toolbar: {
                search: "Поиск",
                downloadCsv: "Скачать CSV",
                viewColumns: "Показать колонки",
                filterTable: "Фильтр таблицы",
            },
            pagination: {
                next: "Следующая страница",
                previous: "Предыдущая страница",
                rowsPerPage: "Строк на странице:",
                displayRows: "из",
            },
            filter: {
                all: "ВСЕ",
                title: "ФИЛЬТРЫ",
                reset: "СБРОСИТЬ",
              },
        }
    };

const showFormCallback = (show, workshop, editing) => {
    setShowForm(!show);
    if(workshop === null){
        return;
    }
    
    const choreographer = choreographers.find(x => x.id === workshop.choreographerId);

    if(!editing && workshop)
        setWorkshops([...workshops, {
            studioName: places.find(x => x.id === workshop.placeId).studioName,
            choreographerName: choreographer.name,
            date: timeHelper.normalizeDate(workshop.date),
            time: timeHelper.normalizeTime(workshop.time),
            choreographerId: workshop.choreographerId,
            style: styles[workshop.style],
            category: categories[workshop.category],
            price: workshop.price,
            minAge: workshop.minAge,
            maxUsers: workshop.maxUsers,
            currentUsersCount: workshop.currentUsersCount,
            id: workshop.id,
            isApprovedByModerator: workshop.isApprovedByModerator ? 'Да' : 'Нет',
            photoName: workshop.photoName,
            // createdBy: workshop.createdBy
        }]);
    else if(workshop){
        var index = workshops.map(x => x.id).indexOf(workshop.id);
        const newArr = workshops.slice(0, index);
        const studioName = places.find(x => x.id === workshop.placeId).studioName;
        newArr.push({
            studioName: studioName,
            date: timeHelper.normalizeDate(workshop.date),
            time: timeHelper.normalizeTime(workshop.time),
            choreographerId: choreographer.id,
            choreographerName: choreographer.name,
            style: styles[workshop.style],
            category: categories[workshop.category],
            price: workshop.price,
            minAge: workshop.minAge,
            maxUsers: workshop.maxUsers,
            currentUsersCount: workshop.currentUsersCount,
            id: workshop.id,
            isApprovedByModerator: workshop.isApprovedByModerator ? 'Да' : 'Нет',
            photoName: workshop.photoName,
            // createdBy: workshop.createdBy
        });

        const secArr = workshops.slice(index + 1, workshops.length);

        const res = newArr.concat(secArr);
        setWorkshops(res);
        setEditing(!editing);
    }
}

    useEffect(() => {
        const userId = storageHelper.getCurrentUserId();
        WorkshopService.getAllWorkshops(userId).then(response => {
            setWorkshops(response.map(x => {
                x.style = styles[x.style];
                x.category = categories[x.category];
                x.date = timeHelper.normalizeDate(x.date);
                x.time = timeHelper.normalizeTime(x.time);
                x.studioName = x.place.studioName;
                x.choreographerName = x.choreographer.name;
                x.isApprovedByModerator = x.isApprovedByModerator ? 'Да' : 'Нет'
                return x;
            }));

        PlaceService.getAllPlaces(userId).then(places => {
            setPlaces(places);
        });

        ChoreographerService.getAll(userId).then(response => {
            setChoreographers(response);
        })
    }).catch(err => {
        if(err.status == 401){
            localStorage.removeItem('token');
            history.push('/login')
        }
    });
    }, []);

    let currentWorkshop = {...workshops[selectedRowToEdit]};
    currentWorkshop.style = Object.keys(styles).find(key => styles[key] === selectedStyle);
    currentWorkshop.category = Object.keys(categories).find(key => categories[key] === selectedCategory);

    return(
        <>
        <div className={classes.root}>
            <Button className={classes.btn} disabled={showForm} onClick={() => {
                setShowForm(true);
                setEditing(false);
            }} type="button" variant="contained" color="primary">
                Создать
            </Button>
        </div>
        
            <MUIDataTable
                title={
                    <Typography variant="h4" id="tableTitle" component="div">
                        Мастер-классы
                    </Typography>
                }
                data={workshops}
                columns={columns}
                options={options}
            />

            <WorkshopForm
                categories={categories}
                styles={styles}
                showForm={showForm}
                editing={editing}
                initialData={editing ? currentWorkshop : {}}
                showFormCallback={showFormCallback}
                places={places}
                choreographers={choreographers}
            />
        </>
    );
}