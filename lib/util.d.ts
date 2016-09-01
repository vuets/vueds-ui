import { Trie } from './trie';
export declare function getUTCOffset(): number;
export declare const UTC_OFFSET: number, HOST_RAW_OFFSET: number, HOST_RAW_OFFSET_SECONDS: number;
export declare function localToUtc(ts: number): number;
export declare function localToUtcSeconds(s: number): number;
export declare function utcToLocal(ts: number): number;
export declare function utcToLocalSeconds(s: number): number;
export declare function newTimeFormatArray(one: any, ago: any, fromNow: any, aSecondAgo: any, justNow: any, seconds: any, minute: any, minutes: any, hour: any, hours: any, yesterday: any, tomorrow: any, days: any, lastWeek: any, nextWeek: any, weeks: any, lastMonth: any, nextMonth: any, months: any, lastYear: any, nextYear: any, years: any, lastCentury: any, nextCentury: any, centuries: any): any[];
export declare const defaultTimeFormatArray: any[];
export declare const regexInt: RegExp, regexDouble: RegExp, regexTime: RegExp, regexDate: RegExp, regexDateTime: RegExp;
export declare const screen: {
    lap: string;
    desk: string;
    wall: string;
    flags: number;
};
export declare function date_columns(): number;
export declare function date_compact_columns(): number;
export declare function table_compact_columns(): number;
export declare function extractFlagsLen(str: string): number;
export declare function newChangeHandler(self: any): (e) => any;
export declare function prevent(e: Event, flags: number): boolean;
export declare function isFlagSet(param: any, flag: number): boolean;
/**
 * Returns the param
 */
export declare function putArgsTo(param: any, array: string[], i: number, flags: number): any;
export declare function prettyDate(ts: number, targetTimeFormatArray: string[], ago?: string, fromNow?: string): string;
export declare function formatDate2(date: Date, fmt: string): string;
export declare function toDay(date: Date): string;
export declare function toD(date: Date): string;
export declare function toMD(date: Date, separator: string): string;
export declare function toYM(date: Date, separator: string): string;
export declare function toYMD(date: Date, separator: string): string;
export declare function toYMDTime(dt: Date, separator: string): string;
export declare function removeTime(date: Date): Date;
export declare function formatTime(v: any): string;
export declare function formatDate(v: any): string;
export declare function formatDateTime(v: any): string;
export declare function isValidDateStr(text: string): number | null;
export declare function isValidDateTimeStr(dt: any): number | null;
export declare function newTrie(stem: any, sorting: any): Trie;
