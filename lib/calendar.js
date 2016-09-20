// ported from https://github.com/WesleydeSouza/calendar-base (MIT)
export function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
export function isLeapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}
export function isDateSelected(date, startDate, endDate) {
    if (date.year === startDate.year && date.month === startDate.month && date.day === startDate.day)
        return true;
    else if (!endDate)
        return false;
    else if (date.year === startDate.year && date.month === startDate.month && date.day < startDate.day)
        return false;
    else if (date.year === endDate.year && date.month === endDate.month && date.day > endDate.day)
        return false;
    else if (date.year === startDate.year && date.month < startDate.month)
        return false;
    else if (date.year === endDate.year && date.month > endDate.month)
        return false;
    else if (date.year < startDate.year)
        return false;
    else if (date.year > endDate.year)
        return false;
    else
        return true;
}
export function diff(date1, date2) {
    var d1 = new Date(Date.UTC(date1.year, date1.month, date1.day, 0, 0, 0, 0)), d2 = new Date(Date.UTC(date2.year, date2.month, date2.day, 0, 0, 0, 0));
    return Math.ceil((d1.getTime() - d2.getTime()) / 86400000);
}
export function interval(date1, date2) {
    return Math.abs(diff(date1, date2)) + 1;
}
export function compare(leftDate, rightDate) {
    if (leftDate.year < rightDate.year)
        return -1;
    else if (leftDate.year > rightDate.year)
        return 1;
    else if (leftDate.month < rightDate.month)
        return -1;
    else if (leftDate.month > rightDate.month)
        return 1;
    else if (leftDate.day < rightDate.day)
        return -1;
    else if (leftDate.day > rightDate.day)
        return 1;
    else
        return 0;
}
/*export function toUTC(date: YMD, day?: number): number {
    return Date.UTC(date.year, date.month, day || date.day, 0, 0, 0, 0)
}*/
export function toYMD(date) {
    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth(),
        day: date.getUTCDate()
    };
}
export function calculateWeekNumber(date) {
    // Creates the requested date
    var current = new Date(Date.UTC(date.year, date.month, date.day, 0, 0, 0, 0));
    // Create a copy of the object
    var target = new Date(current.valueOf());
    // ISO week date weeks start on monday so correct the day number
    var dayNr = (current.getUTCDay() + 6) % 7;
    // ISO 8601 states that week 1 is the week with the first thursday of that
    // year. Set the target date to the thursday in the target week.
    target.setUTCDate(target.getUTCDate() - dayNr + 3);
    // Store the millisecond value of the target date
    var firstThursday = target.valueOf();
    // Set the target to the first thursday of the year
    // First set the target to january first
    target.setUTCMonth(0, 1);
    // Not a thursday? Correct the date to the next thursday
    if (target.getUTCDay() !== 4)
        target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
    // The weeknumber is the number of weeks between the  first thursday of the
    // year and the thursday in the target week.
    // 604800000 = 7 * 24 * 3600 * 1000
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}
function addItemTo(array, item, currentDay, currentWeekNumber, startDate, endDate) {
    var weekNumber;
    if (currentWeekNumber === null)
        weekNumber = calculateWeekNumber(item);
    else if (currentDay === 1 && currentWeekNumber === 52)
        weekNumber = 1;
    else if (currentDay === 1)
        weekNumber = currentWeekNumber + 1;
    else
        weekNumber = currentWeekNumber;
    item.weekNumber = weekNumber;
    item.selected = isDateSelected(item, startDate, endDate);
    array.push(item);
    return weekNumber;
}
export function addItemsTo(array, y, m, opts, startDate, endDate) {
    var date = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0)), year = date.getUTCFullYear(), month = date.getUTCMonth(), firstDay = date.getUTCDay(), firstDate = -(((7 - opts.weekStart) + firstDay) % 7), lastDate = daysInMonth(year, month), lastDay = ((lastDate - firstDate) % 7), lastDatePreviousMonth = daysInMonth(year, month - 1), i = firstDate, max = (lastDate - i) + (lastDay !== 0 ? 7 - lastDay : 0) + firstDate, currentWeekNumber = null, currentDay, currentDate, otherMonth = 0, otherYear = 0, firstDayIndexPending = true, firstDayIndex = 0;
    for (; i < max; i++) {
        currentDate = i + 1;
        currentDay = ((i < 1 ? 7 + i : i) + firstDay) % 7;
        if (currentDate >= 1 && currentDate <= lastDate) {
            if (firstDayIndexPending) {
                firstDayIndexPending = false;
                firstDayIndex = array.length;
            }
            currentWeekNumber = addItemTo(array, {
                day: currentDate,
                weekDay: currentDay,
                month: month,
                year: year,
                siblingMonth: false,
                selected: false,
                weekNumber: -1
            }, currentDay, currentWeekNumber, startDate, endDate);
            continue;
        }
        if (currentDate < 1) {
            otherMonth = month - 1;
            otherYear = year;
            if (otherMonth < 0) {
                otherMonth = 11;
                otherYear--;
            }
            currentDate = lastDatePreviousMonth + currentDate;
        }
        else if (currentDate > lastDate) {
            otherMonth = month + 1;
            otherYear = year;
            if (otherMonth > 11) {
                otherMonth = 0;
                otherYear++;
            }
            currentDate = i - lastDate + 1;
        }
        currentWeekNumber = addItemTo(array, {
            day: currentDate,
            weekDay: currentDay,
            month: otherMonth,
            year: otherYear,
            siblingMonth: true,
            selected: false,
            weekNumber: -1
        }, currentDay, currentWeekNumber, startDate, endDate);
    }
    return firstDayIndex;
}
//# sourceMappingURL=calendar.js.map