import { utcToLocal } from 'vueds/lib/util'
import { prettyDate, toDay, toYMD, toMD, toD, toYM, toYMDTime, formatDate2 } from 'vueds/lib/datetime_util'
import * as numeral from 'numeral'

export function prettydate(value) {
    return value ? prettyDate(value) : ''
}
export function num(value, format?: string) {
    return format === 'unformat'
        ? numeral().unformat(value)
        : numeral(value).format(format || '0,0.00')
}
export function r2(value, format?: string) {
    value = Math.round(value*100)/100;
    return format === 'unformat'
        ? numeral().unformat(value)
        : numeral(value).format(format || '0,0.00')
}
export function s2h(value) {
    return numeral(value/3600).format('0,0.00')
}
export function s2m(value) {
    return numeral(value/60).format('0,0.00')
}
export function hms(value) {
    var hours = Math.floor(value/60/60),
        minutes = Math.floor((value - (hours * 60 * 60))/60),
        seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60))
    
    return ((hours < 10) ? '0' + hours : hours) + ':' + 
            ((minutes < 10) ? '0' + minutes : minutes) + ':' + 
            ((seconds < 10) ? '0' + seconds : seconds)
}
export function hm(value) {
    var hours = Math.floor(value/60/60),
        minutes = Math.floor((value - (hours * 60 * 60))/60)
    
    return ((hours < 10) ? '0' + hours : hours) + ':' + 
            ((minutes < 10) ? '0' + minutes : minutes)
}
export function hm12(value, diff) {
    if (diff) value += (60 * parseInt(diff, 10))
    
    var hours = Math.floor(value/60/60),
        minutes = Math.floor((value - (hours * 60 * 60))/60),
        suffix
    
    if (hours === 0) {
        hours = 12
        suffix = 'am'
    } else if (hours === 12) {
        suffix = 'pm'
    } else if (hours > 12) {
        hours -= 12
        suffix = 'pm'
    } else {
        suffix = 'am'
    }
    
    return ((hours < 10) ? '0' + hours : hours) + ':' + ((minutes < 10) ? '0' + minutes : minutes) + suffix
}
export function hm12c(value, diff) {
    if (diff) value += (60 * parseInt(diff, 10))
    
    var hours = Math.floor(value/60/60),
        minutes = Math.floor((value - (hours * 60 * 60))/60),
        suffix
    
    if (hours === 0) {
        hours = 12
        suffix = 'a'
    } else if (hours === 12) {
        suffix = 'p'
    } else if (hours > 12) {
        hours -= 12
        suffix = 'p'
    } else {
        suffix = 'a'
    }
    
    return ((hours < 10) ? '0' + hours : hours) + ':' + ((minutes < 10) ? '0' + minutes : minutes) + suffix
}
export function day(value) {
    return toDay(new Date(utcToLocal(value)))
}
export function ymd_day(value, separator) {
    var buf = ''
    if (!value) return buf
    
    var d = new Date(utcToLocal(value))
    buf += toYMD(d, separator || '/')
    buf += ' '
    buf += toDay(d)
    return buf
}
export function md_day(value, separator) {
    var buf = ''
    if (!value) return buf
    
    var d = new Date(utcToLocal(value))
    buf += toMD(d, separator || '/')
    buf += ' '
    buf += toDay(d)
    return buf
}
export function md_day_html(value, separator) {
    var buf = ''
    if (!value) return buf
    
    var d = new Date(utcToLocal(value))
    buf += toMD(d, separator || '/')
    buf += '<div class="day">'
    buf += toDay(d)
    buf += '</div>'
    return buf
}
export function d(value) {
    return !value ? '' : toD(new Date(utcToLocal(value)))
} 
export function md(value, separator) {
    return !value ? '' : toMD(new Date(utcToLocal(value)), separator || '/')
}
export function ym(value, separator) {
    return !value ? '' : toYM(new Date(utcToLocal(value)), separator || '/')
}
export function ymd(value, separator) {
    return !value ? '' : toYMD(new Date(utcToLocal(value)), separator || '/')
}
export function ymdtime(value, separator) {
    return !value ? '' : toYMDTime(new Date(utcToLocal(value)), separator || '/')
}
export function ymdtimestamp(value, separator) {
    return !value ? '' : toYMDTime(new Date(value), separator || '/')
}
export function ymd2(value) {
    return !value ? '' : formatDate2(new Date(utcToLocal(value)), '#YYYY#/#MM#/#DD#')
}
export function ymdtime2(value) {
    return !value ? '' : formatDate2(new Date(utcToLocal(value)), '#YYYY#/#MM#/#DD# #hhh#:#mm#:#ss#')
}
export function ymdtimestamp2(value) {
    return !value ? '' : formatDate2(new Date(value), '#YYYY#/#MM#/#DD# #hhh#:#mm#:#ss#')
}
