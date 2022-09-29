import {React} from 'react';
import { Redirect } from 'react-router-dom';
import storageHelper from '../helpers/storageHelper';
import WorkshopContainer from '../components/workshops/workshopContainer';
import AdminTable from '../components/dataTable/adminTable';

export default function Main(){
    const isOrganizer = storageHelper.isOrganizer();
    return(
        <>
            {storageHelper.isAuthenticated() ? 
                
                isOrganizer ? <AdminTable /> :
                // <WorkshopTable fromWorkshops={false} isOrganizer={isOrganizer} />
                <WorkshopContainer isDesired={false} />
            :
                <Redirect to='/login' />
            }
        </>
    );
}