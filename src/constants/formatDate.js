import { formatRelative } from 'date-fns';

export function formatDate(seconds) {
    let formatDate = "";

    if(seconds){
        formatDate = formatRelative(new Date(seconds * 1000), new Date());
        formatDate = formatDate.charAt(0).toUpperCase() + formatDate.slice(1);
    }
    return formatDate;
}