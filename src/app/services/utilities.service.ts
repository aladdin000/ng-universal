import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable({
    providedIn: 'root',
})
export class UtilitiesService {

    /**
     * Pass in a String of a Date (no time)
     * Returns secounds until the start of the given day
     * @param strDate
     */
    public timeUntilDate(strDate) {
        const y = moment().tz('America/New_York');
        const tzOffset = moment(strDate).tz('America/New_York').format('TZ').substring(1);
        const x = moment(strDate + ' 00:00:00' + tzOffset).tz('America/New_York');
        return x.diff(y, 'seconds');
    }

    /**
     *
     * Pass in a String of a Date (no time)
     * Returns secounds until the end of the given day
     * @param strDate
     */
    public timeUntilEndDate(strDate) {
        const y = moment().tz('America/New_York');
        const tzOffset = moment(strDate).tz('America/New_York').format('TZ').substring(1);
        const x = moment(strDate + ' 23:59:59' + tzOffset).tz('America/New_York');
        return x.diff(y, 'seconds');
    }

    /**
     * Pass in a String of a Date and Time
     * Returns secounds until then
     * @param strDate
     */
    public timeUntilDateTime(strDate) {
        const y = moment().tz('America/New_York');
        const tzOffset = moment(strDate).tz('America/New_York').format('TZ').substring(1);
        const x = moment(strDate).tz('America/New_York');
        return x.diff(y, 'seconds');
    }

    /**
     * Check if property is defined
     */
    public defined(ref, strNames?: string) {
        let name;

        if (typeof ref === 'undefined' || ref === null) {
            return false;
        }

        if (strNames !== null && typeof strNames !== 'undefined') {
            const arrNames = strNames.split('.');
            name = arrNames.shift();
            while (name) {
                if (ref[name] === null || typeof ref[name] === 'undefined') {
                    return false;
                }
                ref = ref[name];
                name = arrNames.shift();
            }
        }
        return true;
    }

    public isBeforeDate(dateString) {
        return this.timeUntilDateTime(dateString) > 0;
    }

    public isAfterDate(dateString) {
        return this.timeUntilDateTime(dateString) <= 0;
    }
}
