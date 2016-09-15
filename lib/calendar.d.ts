export interface YMD {
    year: number;
    month: number;
    day: number;
}
export interface Opts {
    weekStart: number;
}
export declare function daysInMonth(year: number, month: number): number;
export declare function isLeapYear(year: number): boolean;
export declare function isDateSelected(date: YMD, startDate: YMD, endDate?: YMD): boolean;
export declare function diff(date1: YMD, date2: YMD): number;
export declare function interval(date1: YMD, date2: YMD): number;
export declare function compare(leftDate: YMD, rightDate: YMD): number;
export declare function calculateWeekNumber(date: YMD): number;
export interface Item extends YMD {
    siblingMonth: boolean;
    selected: boolean;
    weekDay: number;
    weekNumber: number;
}
export declare function getCalendar(y: number, m: number, opts: Opts, startDate: YMD, endDate?: YMD): Item[];
