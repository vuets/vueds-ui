// ported from https://github.com/WesleydeSouza/calendar-base (MIT)

export interface YMD {
    year: number
    month: number
    day: number
}

export interface Opts {
    startDate: YMD
    endDate?: YMD
    weekStart: number // 0
    // on by default
    //siblingMonths: boolean
    //weekNumbers: boolean
}

export function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
}

export function isLeapYear(year: number): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
}

export function isDateSelected(opts: Opts, date: YMD): boolean {
	if (date.year === opts.startDate.year && date.month === opts.startDate.month && date.day === opts.startDate.day)
		return true
    else if (!opts.endDate)
        return false
    else if (date.year === opts.startDate.year && date.month === opts.startDate.month && date.day < opts.startDate.day)
        return false
    else if (date.year === opts.endDate.year && date.month === opts.endDate.month && date.day > opts.endDate.day)
        return false
    else if (date.year === opts.startDate.year && date.month < opts.startDate.month)
        return false
    else if (date.year === opts.endDate.year && date.month > opts.endDate.month)
        return false
    else if (date.year < opts.startDate.year)
        return false
    else if (date.year > opts.endDate.year)
        return false
    else
        return true
}

export function diff(date1: YMD, date2: YMD): number {
	let d1 = new Date(Date.UTC(date1.year, date1.month, date1.day, 0, 0, 0, 0)),
        d2 = new Date(Date.UTC(date2.year, date2.month, date2.day, 0, 0, 0, 0))
	
    return Math.ceil((d1.getTime() - d2.getTime()) / 86400000)
}

export function interval(date1: YMD, date2: YMD): number {
    return Math.abs(diff(date1, date2)) + 1
}

export function compare(leftDate: YMD, rightDate: YMD): number {
    if (leftDate.year < rightDate.year)
        return -1
    else if (leftDate.year > rightDate.year)
        return 1
    else if (leftDate.month < rightDate.month)
        return -1
    else if (leftDate.month > rightDate.month)
        return 1
    else if (leftDate.day < rightDate.day)
        return -1
    else if (leftDate.day > rightDate.day)
        return 1
    else
        return 0
}

export function calculateWeekNumber(date: YMD): number {
	// Creates the requested date
	var current = new Date(Date.UTC(date.year, date.month, date.day, 0, 0, 0, 0))

	// Create a copy of the object
	var target = new Date(current.valueOf())

	// ISO week date weeks start on monday so correct the day number
	var dayNr = (current.getUTCDay() + 6) % 7

	// ISO 8601 states that week 1 is the week with the first thursday of that
	// year. Set the target date to the thursday in the target week.
	target.setUTCDate(target.getUTCDate() - dayNr + 3)

	// Store the millisecond value of the target date
	var firstThursday = target.valueOf()

	// Set the target to the first thursday of the year

	// First set the target to january first
	target.setUTCMonth(0, 1)

	// Not a thursday? Correct the date to the next thursday
	if (target.getUTCDay() !== 4)
		target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7)

	// The weeknumber is the number of weeks between the  first thursday of the
	// year and the thursday in the target week.
	// 604800000 = 7 * 24 * 3600 * 1000
	return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
}

export interface DateItem extends YMD {
    siblingMonth: boolean
    selected: boolean
    weekDay: number
    weekNumber: number
}

function addItemTo(array: DateItem[], item: DateItem, opts: Opts, currentDay: number, currentWeekNumber: number|null): number {
    let weekNumber: number
    if (currentWeekNumber === null)
        weekNumber = calculateWeekNumber(item)
    else if (currentDay === 1 && currentWeekNumber === 52)
        weekNumber = 1
    else if (currentDay === 1)
        weekNumber = currentWeekNumber + 1
    else
        weekNumber = currentWeekNumber
    
    item.weekNumber = weekNumber
    item.selected = isDateSelected(opts, item)

    array.push(item)

    return weekNumber
}

export function getCalendar(opts: Opts, y: number, m: number): DateItem[] {
    let calendar: DateItem[] = [],
        date = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0)),
        year = date.getUTCFullYear(),
        month = date.getUTCMonth(),
        firstDay = date.getUTCDay(),
        firstDate = - (((7 - opts.weekStart) + firstDay) % 7),
        lastDate = daysInMonth(year, month),
        lastDay = ((lastDate - firstDate) % 7),
        lastDatePreviousMonth = daysInMonth(year, month - 1),
        i = firstDate,
        max = (lastDate - i) + (lastDay !== 0 ? 7 - lastDay : 0) + firstDate,
        currentWeekNumber: number|null = null,
        currentDay: number,
        currentDate: number,
        otherMonth = 0,
        otherYear= 0

    while (i < max) {
        currentDate = i + 1;
        currentDay = ((i < 1 ? 7 + i : i) + firstDay) % 7;
        if (currentDate >= 1 && currentDate <= lastDate) {
            currentWeekNumber = addItemTo(calendar, {
                day: currentDate,
                weekDay: currentDay,
                month: month,
                year: year,
                siblingMonth: false,
                selected: false,
                weekNumber: -1
            }, opts, currentDay, currentWeekNumber)

            i++
            continue
        }

        if (currentDate < 1) {
            otherMonth = month - 1
            otherYear = year
            if (otherMonth < 0) {
                otherMonth = 11
                otherYear--
            }
            currentDate = lastDatePreviousMonth + currentDate
        } else if (currentDate > lastDate) {
            otherMonth = month + 1;
            otherYear = year;
            if (otherMonth > 11) {
                otherMonth = 0;
                otherYear++;
            }
            currentDate = i - lastDate + 1;
        }

        currentWeekNumber = addItemTo(calendar, {
            day: currentDate,
            weekDay: currentDay,
            month: otherMonth,
            year: otherYear,
            siblingMonth: true,
            selected: false,
            weekNumber: -1
        }, opts, currentDay, currentWeekNumber)

        i++
    }

    return calendar
}
