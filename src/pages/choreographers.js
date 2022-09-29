import {React, useEffect, useState} from 'react';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ChoreographerService from '../services/choreographerService';
import ChoreographerForm from '../components/forms/choreographerForm';
import {styles} from '../constants/commonData';
import timeHelper from '../helpers/dateHelper';
import Typography from '@material-ui/core/Typography';
import storageHelper from '../helpers/storageHelper';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      display: 'flex',
      maxWidth: 1198,
      margin: 22,
    },
    btn: {
        color: 'black',
        backgroundColor: '#B2C8D6',
        "&:hover": {
        backgroundColor: '#F59B69',
        },
    }
}));


export default function Choregraphers(){
    const classes = useStyles();

    const [showForm, setShowForm] = useState(false);
    const [choreographers, setChoreographers] = useState([]);
    const [selectedRowToEdit, setSelectedRowToEdit] = useState(null);
    const [editing, setEditing] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('');

    const columns = [
        {
            name: " ",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Button style={{width: 220}} className={classes.btn} disabled={showForm} onClick={() => 
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
        { name: 'id', label: 'Номер' },
        { name: 'name', label: 'Имя' },
        { name: 'dateOfBirth', label: 'Дата рождения' },
        { name: 'description', label: 'Описание' },
        { name: 'style', label: 'Основной стиль' },
        { name: 'link', label: 'Соцсеть' },
    ];

    const handleRowClick = (rowData, rowMeta) => {
        setSelectedRowToEdit(rowMeta.dataIndex);
        setSelectedStyle(rowData[5]);
    };

    const options = {
        filterType: 'dropdown',
        responsive: 'standard',
        download: false,
        print: false,
        viewColumns: false,
        onRowClick: handleRowClick,
        onDownload: (buildHead, buildBody, columns, data) => {
            return "\uFEFF" + buildHead(columns) + buildBody(data); 
        },
        selectableRows: 'none',
        textLabels: {
            body: {
              noMatch: "Извините, данных нет",
              toolTip: "Сортировка",
              columnHeaderTooltip: column => `Сортировать по ${column.label}`
            },
            toolbar: {
                search: "Поиск",
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

    const showFormCallback = (show, choreographer, editing) => {
        setShowForm(!show);
        
        if(!editing && choreographer)
            setChoreographers([...choreographers, {
                name: choreographer.name,
                dateOfBirth: timeHelper.normalizeDate(choreographer.dateOfBirth),
                description: choreographer.description,
                link: choreographer.link,
                id: choreographer.id,
                style: styles[choreographer.style],
            }]);
        else if(choreographer){
            var index = choreographers.map(x => x.id).indexOf(choreographer.id);
            const newArr = choreographers.slice(0, index);
            newArr.push({
                name: choreographer.name,
                dateOfBirth: timeHelper.normalizeDate(choreographer.dateOfBirth),
                description: choreographer.description,
                link: choreographer.link,
                id: choreographer.id,
                style: styles[choreographer.style],
            });
    
            const secArr = choreographers.slice(index + 1, choreographers.length);
    
            const res = newArr.concat(secArr);
            setChoreographers(res);
            setEditing(!editing);
        }
    }

    useEffect(() => {
        ChoreographerService.getAll(storageHelper.getCurrentUserId()).then(response => {
            setChoreographers(response.map(x => {
                x.style = styles[x.style];
                x.dateOfBirth = timeHelper.normalizeDate(x.dateOfBirth);
                return x;
            }));
    });
    }, []);
    
    const currentChoreographer = {...choreographers[selectedRowToEdit]};
    currentChoreographer.style = Object.keys(styles).find(key => styles[key] === selectedStyle);

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
                           Хореографы
                        </Typography>
                    }
                    data={choreographers}
                    columns={columns}
                    options={options}
                />

                <ChoreographerForm
                    showForm={showForm}
                    editing={editing}
                    initialData={editing ? currentChoreographer : {}}
                    showFormCallback={showFormCallback}
                    styles={styles}
                />
        </>
    );
}