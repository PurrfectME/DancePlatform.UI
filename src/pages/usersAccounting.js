import React from 'react';
import WorkshopTable from '../components/dataTable/workshopTable';
import storageHelper from '../helpers/storageHelper';


export default function UsersAccounting({match}){
    const {workshopId} = match.params;
    const isOrganizer = storageHelper.isOrganizer();
    return(
        <>
            <WorkshopTable fromWorkshops={false} isOrganizer={isOrganizer} workshopId={workshopId} />
        </>
    )
}