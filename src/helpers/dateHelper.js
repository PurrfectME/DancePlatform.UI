import moment from 'moment';

function normalizeDate(sharpDate) {
    const date = moment(sharpDate);

    return date.format('YYYY-MM-DD');
};

function normalizeTime(sharpDate) {
    const date = moment(sharpDate);
    

    const h = date.hours();
    const m = date.minutes();
    return date.format('HH:mm');
};

function isBeforeWithAddDays(leftDate, rightDate, addDays) {
    const firstDate = moment(leftDate);
    const secondDate = moment(rightDate).add(addDays, 'days');

    return firstDate < secondDate;
}

function toUtc(date){
    return moment.utc(date).add(3, 'hours').format('YYYY-MM-DD[T]HH:mm:ss.SSS [UTC]');
}

const timeHelper = {
    normalizeDate,
    normalizeTime,
    isBeforeWithAddDays,
    toUtc,
}

export default timeHelper;