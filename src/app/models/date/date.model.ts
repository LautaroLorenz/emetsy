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
}