export function formatDate(dateString: string) {
    const options:  Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString(undefined, options);
  }
  
  export function formatMilitaryTime(timeString: string) {
    const [hours, minutes] = timeString.split(':');
    const formattedTime = `${parseInt(hours, 10)}h${minutes}`;
    return formattedTime;
  };

  export function formatDateYearMonthDate(date: any) {
    var d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);

    var month = '' + (d.getUTCMonth() + 1),
        day = '' + d.getUTCDate(),
        year = d.getUTCFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}