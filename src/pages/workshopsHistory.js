import {React} from 'react';
import WorkshopTable from '../components/dataTable/workshopTable';
import storageHelper from '../helpers/storageHelper';



export default function WorkshopsHistory(){

    const isOrganizer = storageHelper.isOrganizer();
    return(
        <>
            <WorkshopTable fromWorkshops={false} isOrganizer={isOrganizer} isHistory={true} />
        </>
    )
}