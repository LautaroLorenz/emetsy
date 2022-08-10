export class DateHelper {
  static getNow(): string {
    const now = new Date();
    const day = now.getDate();
    const dd = day < 10 ? '0' + day : day;
    const month = now.getMonth() + 1;
    const mm = month < 10 ? '0' + month : month;
    const hour = now.getHours();
    const hh = (hour < 10) ? '0' + hour : hour;
    const minute = now.getMinutes();
    const min = (minute < 10) ? '0' + minute : minute;
    return dd + "/" + mm + "/" + now.getFullYear() + " " + (hh || '00') + ':' + (min || '00');
  }

  static getLastMonth(): string {
    const now = new Date();
    const prevMonth = now.getMonth() - 1;
    const year = now.getFullYear();
    const lastMonth = new Date(year, prevMonth, 1);
    const day = lastMonth.getDate();
    const dd = day < 10 ? '0' + day : day;
    const month = lastMonth.getMonth() + 1;
    const mm = month < 10 ? '0' + month : month;
    return dd + "/" + mm + "/" + lastMonth.getFullYear() + " " + '00:00';
  }

  /**
   * @param date format 'DD/MM/YYYY hh:mm'
   */
  static getTime(date: string): number {
    const parts = date.split(" ");
    const datePart = parts[0];
    const timePart = parts[1];
    const dateParts = datePart.split("/");
    const DD = dateParts[0];
    const MM = dateParts[1];
    const YYYY = dateParts[2];  
    const HH = timePart[0];  
    const mm = timePart[1];
    const casted = new Date(`${YYYY}-${MM}-${DD} ${HH}:${mm}`);
    return casted.getTime();
  }
}