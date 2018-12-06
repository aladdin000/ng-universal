import * as moment from 'moment-timezone';

export class GarpTimeHelper {
  public static isBeforeDate(date: string): boolean {
    return GarpTimeHelper.timeUntilDateTime(date) > 0;
  }

  public static isAfterDate(date: string): boolean {
    return GarpTimeHelper.timeUntilDateTime(date) <= 0;
  }

  public static formatEastern(date: string, format: string): string {
    if (date) {
      const mDate = moment(date);
      return mDate.tz("America/New_York").format(format);
    }

    return '';
  }

  public static timeUntilDateTime(date: string): number {
    const nYTimeNow = moment().tz('America/New_York');
    const nYPickedDate = moment(date).tz('America/New_York');

    return nYPickedDate.diff(nYTimeNow, 'seconds');
  }
}
