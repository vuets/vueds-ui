import { Trie } from './trie';
var numeral = require('numeral'), 
// browser sniffing from vuejs
UA = window.navigator.userAgent.toLowerCase(), isIE = UA && UA.indexOf('trident') > 0, isIE9 = UA && UA.indexOf('msie 9.0') > 0, createEvent = document['createEvent'], createEventObject = document['createEventObject'], setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, hasClassList = 'classList' in document.documentElement, MILLIS_PER_DAY = 1000 * 60 * 60 * 24, monthRegularArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], monthLeapArray = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], daysArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function setClass(el, cls) {
    if (isIE9 && !/svg$/.test(el.namespaceURI)) {
        el.className = cls;
    }
    else {
        el.setAttribute('class', cls);
    }
}
/**
 * For IE9 compat: when both class and :class are present
 * getAttribute('class') returns wrong value...
 *
 * @param {Element} el
 * @return {String}
 */
function getClass(el) {
    var className = el.className;
    return typeof className !== 'object' ? className : (className.baseVal || '');
}
//export const { addClass } = Vue.util
export function addClass(el, cls) {
    if (el.classList) {
        el.classList.add(cls);
    }
    else {
        var cur = ' ' + getClass(el) + ' ';
        if (cur.indexOf(' ' + cls + ' ') < 0) {
            setClass(el, (cur + cls).trim());
        }
    }
}
function getDateUTCOffset(date) {
    var n = date.getTimezoneOffset() * -10 / 6, r;
    if (n < 0) {
        r = (n - 10000).toString();
        return r.charAt(0) + r.substr(2);
    }
    else {
        r = (n + 10000).toString();
        return '+' + r.substr(1);
    }
}
export function getUTCOffset() {
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    var offset = getDateUTCOffset(date);
    if (offset.indexOf('+') === 0) {
        return parseInt(offset.substring(1, offset.length - 2), 10);
    }
    else if (offset.indexOf('-') === 0) {
        return -parseInt(offset.substring(1, offset.length - 2), 10);
    }
    else {
        /*
            * IE in some cases will return this value starting with undefined.  That means
            * negative.
            */
        return -parseInt(offset.substring(10, offset.length - 2), 10);
    }
}
export var UTC_OFFSET = getUTCOffset(), HOST_RAW_OFFSET = UTC_OFFSET * 60 * 60 * 1000, HOST_RAW_OFFSET_SECONDS = UTC_OFFSET * 60 * 60;
export function localToUtc(ts) {
    return ts + HOST_RAW_OFFSET;
}
export function localToUtcSeconds(s) {
    return s + HOST_RAW_OFFSET_SECONDS;
}
export function utcToLocal(ts) {
    return ts - HOST_RAW_OFFSET;
}
export function utcToLocalSeconds(s) {
    return s - HOST_RAW_OFFSET_SECONDS;
}
export function newTimeFormatArray(one, ago, fromNow, aSecondAgo, justNow, seconds, minute, minutes, hour, hours, yesterday, tomorrow, days, lastWeek, nextWeek, weeks, lastMonth, nextMonth, months, lastYear, nextYear, years, lastCentury, nextCentury, centuries) {
    return [
        [2, aSecondAgo, justNow],
        [60, seconds, 1],
        [120, one + " " + minute + " " + ago, one + " " + minute + " " + fromNow],
        [3600, minutes, 60],
        [7200, one + " " + hour + " " + ago, one + " " + hour + " " + fromNow],
        [86400, hours, 3600],
        [172800, yesterday, tomorrow],
        [604800, days, 86400],
        [1209600, lastWeek, nextWeek],
        [2419200, weeks, 604800],
        [4838400, lastMonth, nextMonth],
        [29030400, months, 2419200],
        [58060800, lastYear, nextYear],
        [2903040000, years, 29030400],
        [5806080000, lastCentury, nextCentury],
        [58060800000, centuries, 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
}
export var defaultTimeFormatArray = newTimeFormatArray("1", "ago", "from now", "a second ago", "just now", "seconds", "minute", "minutes", "hour", "hours", "yesterday", "tomorrow", "days", "last week", "next week", "weeks", "last month", "next month", "months", "last year", "next year", "years", "last century", "next century", "centuries");
export var regexInt = /^-?[0-9]+$/, regexDouble = /^-?[0-9]+(\.[0-9]+)?$/, regexTime = /^[0-2]?[0-9]\:[0-5][0-9](\:[0-5][0-9])?$/, regexDate = /^[1-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9]$/, regexDateTime = /^[1-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9] [0-2]?[0-9]\:[0-5][0-9]\:[0-5][0-9]$/;
export var screen = {
    lap: 'screen and (min-width:48em)',
    desk: 'screen and (min-width:62em)',
    wall: 'screen and (min-width:75em)',
    flags: 0
};
export function date_columns() {
    var flags = screen.flags;
    if (flags === 0)
        return 2;
    else if (flags & 4)
        return 14;
    else
        return 7;
}
export function date_compact_columns() {
    var flags = screen.flags;
    if (flags === 0)
        return 3;
    else if (flags & 4)
        return 16;
    else
        return 9;
}
export function table_compact_columns() {
    var flags = screen.flags;
    if (flags === 0)
        return 4;
    else if (flags & 4)
        return 12;
    else
        return 6;
}
export function isInput(el) {
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
}
export function findupClass(el, cls, limit) {
    if (hasClassList) {
        do {
            if (el.classList.contains(cls))
                return el;
            el = el.parentElement;
        } while (--limit > 0);
    }
    else {
        do {
            if (el.className.indexOf(cls) !== -1)
                return el;
            el = el.parentElement;
        } while (--limit > 0);
    }
    return null;
}
export function hasClass(el, cls) {
    return hasClassList ? el.classList.contains(cls) : el.className.indexOf(cls) !== -1;
}
export function removeClass(el, cls) {
    var removed;
    if (hasClassList) {
        var classList = el.classList, len = classList.length;
        classList.remove(cls);
        removed = len > classList.length;
        if (removed && len === 1)
            el.removeAttribute('class');
    }
    else {
        var cur = ' ' + el.className + ' ', tar = ' ' + cls + ' ';
        removed = false;
        while (cur.indexOf(tar) >= 0) {
            cur = cur.replace(tar, ' ');
            removed = true;
        }
        if (removed)
            setClass(el, cur.trim());
    }
    return removed;
}
export function toggleClass(el, cls) {
    if (hasClassList) {
        var classList = el.classList, len = classList.length;
        classList.remove(cls);
        if (len === classList.length)
            classList.add(cls);
    }
    else {
        var className = el.className, cur = ' ' + className + ' ', tar = ' ' + cls + ' ', removed = false;
        while (cur.indexOf(tar) >= 0) {
            cur = cur.replace(tar, ' ');
            removed = true;
        }
        setClass(el, removed ? cur.trim() : className + ' ' + cls);
    }
}
/*export function toggleActive(el) {
    if (removeClass(el, 'active')) {
        var vm = el.__vue__ || getFirstVm(el)
        if (vm && vm.handle(2))
            vm.$broadcast('vui', 2)
        if (el.className === 'modal' || el.className === 'dropdown')
            document.modalId = null
    } else {
        if (el.className === 'modal' || el.className === 'dropdown')
            document.modalId = el.id
        addClass(el, 'active')
        var vm = el.__vue__ || getFirstVm(el)
        if (vm && vm.handle(1))
            vm.$broadcast('vui', 1)
    }
}*/
export function getLastChildElement(el) {
    return el.childElementCount ? el.children[el.childElementCount - 1] : null;
}
export function getFirstChildElement(el) {
    return el.childElementCount ? el.children[0] : null;
    /*var child = el.firstChild;
    while (child && child.nodeType != 1)
        child = child.nextSibling;
    return child;*/
}
export function resolveRelativeElement(el, str) {
    var startIdx = str.charAt(0) === '-' ? 1 : 0, dotIdx = str.indexOf('.' /*, startIdx*/), i;
    if (dotIdx === startIdx) {
        // siblings
        i = parseInt(str.substring(dotIdx + 1), 10);
        if (startIdx === 0) {
            while (i--)
                el = el.nextElementSibling;
        }
        else {
            while (i--)
                el = el.previousElementSibling;
        }
        return el;
    }
    i = parseInt(dotIdx === -1 ? str : str.substring(startIdx, dotIdx), 10);
    while (i--)
        el = el.parentElement;
    if (dotIdx === -1)
        return el;
    i = parseInt(str.substring(dotIdx + 1), 10);
    if (startIdx) {
        // negative, so start from bottom
        el = el.lastElementChild;
        while (i--)
            el = el.previousElementSibling;
    }
    else {
        el = el.firstElementChild;
        while (i--)
            el = el.nextElementSibling;
    }
    return el;
}
// TODO optimize: parseInt is not necessary if the length is 1 (simply deduct 48)
export function chainResolveRelativeElement(el, array, i) {
    for (var l = array.length; i < l; i++)
        el = resolveRelativeElement(el, array[i]);
    return el;
}
export function resolveElement(el, value, vm) {
    if (!isNaN(value) || (vm && value.charAt(0) === '$' && !isNaN(value = vm.$get(value)))) {
        return resolveRelativeElement(el, value);
    }
    else if (value.indexOf('__') !== -1)
        return chainResolveRelativeElement(el, value.split('__'), 0);
    else
        return document.getElementById(value);
}
export function resolveElementArray(el, value, selectFromParent, vm) {
    if (Array.isArray(value)) {
        return !value[0] ?
            [chainResolveRelativeElement(el, value, 1)] :
            value.map(function (item) { return resolveElement(el, item, vm); });
    }
    else if (!isNaN(value))
        return [resolveRelativeElement(el, value)];
    else if (value.indexOf('__') !== -1)
        return [chainResolveRelativeElement(el, value.split('__'), 0)];
    else if (selectFromParent)
        return el.parentElement.querySelectorAll(value);
    else
        return el.querySelectorAll(value);
}
export function resolveNextPageIdx(page, idx, array, pager) {
    return page !== pager.page_count ? idx : Math.min(idx, (pager.size % array.length) - 1);
}
// TODO remove this (prefer above)
export function resolveNextPageIndex(pager, idx) {
    /*if (idx === -1) return idx
    
    var pageSize = pager.array.length,
        size = pager.size,
        deduct = pager.page * pageSize,
        remaining = size - deduct
    
    return Math.min(idx, remaining - 1)*/
    return pager.page !== pager.page_count ? idx : Math.min(idx, (pager.size % pager.array.length) - 1);
}
// TODO move to different file
export function selectIdx(idx, array, store, clickUpdate) {
    var pojo = array[idx], flags = 0;
    if (clickUpdate) {
        pojo = array[idx];
        pojo['vstate'] |= 16 /* UPDATE */;
        flags = 3 /* CLICKED_UPDATE */;
    }
    store.select(pojo, flags, idx);
}
export function pageAndSelectIdx(page, idx, array, store, clickUpdate) {
    var pojo = array[idx], flags = 0;
    if (clickUpdate) {
        pojo = array[idx];
        pojo['vstate'] |= 16 /* UPDATE */;
        flags = 3 /* CLICKED_UPDATE */;
    }
    store.$populate(2 /* SELECT */, flags, store.isMainArray(), idx, page);
}
export function tableUp(pager, col_size, flags, idx, e, clickUpdate) {
    e.preventDefault();
    var array = pager.array, index_hidden;
    if (idx === -1) {
        index_hidden = pager.index_hidden;
        // select the visible item at the bottom (last)
        if (index_hidden)
            selectIdx(index_hidden - 1, array, pager['store'], clickUpdate);
    }
    else if (idx >= col_size) {
        selectIdx(idx - col_size, array, pager['store'], clickUpdate);
    }
    else if (pager.page) {
        // move to previous page
        pageAndSelectIdx(--pager.page, (col_size * (array.length / col_size - 1)) + idx, array, pager['store'], clickUpdate);
    }
}
export function tableJumpUp(pager, col_size, flags, idx, e, clickUpdate) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(Math.min(col_size - 1, pager.index_hidden - 1), array, pager['store'], clickUpdate);
    }
    else if (idx >= col_size) {
        selectIdx(idx % col_size, array, pager['store'], clickUpdate);
    }
    else if (pager.page) {
        // move to previous page
        pageAndSelectIdx(--pager.page, (col_size * (pager.array.length / col_size - 1)) + (idx % col_size), array, pager['store'], clickUpdate);
    }
}
export function tableDown(pager, col_size, flags, idx, e, clickUpdate) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(0, array, pager['store'], clickUpdate);
    }
    else if (idx + col_size < pager.index_hidden) {
        selectIdx(idx + col_size, array, pager['store'], clickUpdate);
    }
    else if (pager.page < pager.page_count) {
        // move to next page
        var page = ++pager.page;
        pageAndSelectIdx(page, page === pager.page_count ?
            Math.min(idx % col_size, (pager.size % pager.array.length) - 1) : (idx % col_size), array, pager['store'], clickUpdate);
    }
}
export function tableJumpDown(pager, col_size, flags, idx, e, clickUpdate) {
    e.preventDefault();
    var array = pager.array, row_size = pager.array.length / col_size;
    if (idx === -1) {
        selectIdx(Math.min(col_size * (row_size - 1), pager.index_hidden - 1), array, pager['store'], clickUpdate);
    }
    else if (idx < col_size * (row_size - 1)) {
        idx = col_size * (row_size - 1) + (idx % col_size);
        if (idx < pager.index_hidden)
            selectIdx(idx, array, pager['store'], clickUpdate);
    }
    else if (pager.page < pager.page_count) {
        // move to next page
        var page = ++pager.page;
        pageAndSelectIdx(page, page === pager.page_count ?
            Math.min(idx % col_size, (pager.size % pager.array.length) - 1) : (idx % col_size), array, pager['store'], clickUpdate);
    }
}
export function tableLeft(pager, col_size, flags, idx, e, clickUpdate) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(Math.min(col_size - 1, pager.index_hidden - 1), array, pager['store'], clickUpdate);
    }
    else if (idx % col_size !== 0) {
        selectIdx(idx - 1, array, pager['store'], clickUpdate);
    }
    else if (pager.page !== 0) {
        // move to previous page
        pageAndSelectIdx(--pager.page, idx + col_size - 1, array, pager['store'], clickUpdate);
    }
}
export function tableJumpLeft(pager, col_size, flags, idx, e, clickUpdate) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(0, array, pager['store'], clickUpdate);
    }
    else if (idx % col_size !== 0) {
        selectIdx(idx - (idx % col_size), array, pager['store'], clickUpdate);
    }
    else if (pager.page !== 0) {
        // move to previous page (same as left)
        pageAndSelectIdx(--pager.page, idx + col_size - 1, array, pager['store'], clickUpdate);
    }
}
export function tableRight(pager, col_size, flags, idx, e, clickUpdate) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(Math.min(col_size * (pager.array.length / col_size - 1), pager.index_hidden - 1), array, pager['store'], clickUpdate);
    }
    else if (pager.page === pager.page_count) {
        if ((idx + 1) % col_size !== 0 && (idx + 1) < pager.index_hidden) {
            selectIdx(idx + 1, array, pager['store'], clickUpdate);
        }
    }
    else if ((idx + 1) % col_size === 0) {
        // move to next page
        var page = ++pager.page;
        pageAndSelectIdx(page, resolveNextPageIdx(page, idx - col_size + 1, array, pager), array, pager['store'], clickUpdate);
    }
    else {
        selectIdx(idx + 1, array, pager['store'], clickUpdate);
    }
}
export function tableJumpRight(pager, col_size, flags, idx, e, clickUpdate) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(Math.min(col_size - 1, pager.index_hidden - 1), array, pager['store'], clickUpdate);
    }
    else if (pager.page === pager.page_count) {
        if ((idx + 1) % col_size !== 0 && (idx + 1) < pager.index_hidden) {
            selectIdx(Math.min(idx - (idx % col_size) + col_size - 1, pager.index_hidden - 1), array, pager['store'], clickUpdate);
        }
    }
    else if ((idx + 1) % col_size == 0) {
        // move to next page (same as right)
        var page = ++pager.page;
        pageAndSelectIdx(page, resolveNextPageIdx(page, idx - col_size + 1, array, pager), array, pager['store'], clickUpdate);
    }
    else {
        selectIdx(idx - (idx % col_size) + col_size - 1, array, pager['store'], clickUpdate);
    }
}
export function extractFlagsLen(str) {
    var len = 0, i = str.length - 1, c = str.charCodeAt(i);
    while (c >= 48 && c <= 57) {
        c = str.charCodeAt(--i);
        len++;
    }
    return len;
}
export function newChangeHandler(self) {
    return function (e) {
        var code = e.which || e.keyCode;
        if (13 === code) {
            e.preventDefault();
            self.el.blur();
            self.el.focus();
        }
    };
}
export function prevent(e, flags) {
    switch (flags & 3) {
        case 1:
            e.preventDefault();
            return false;
        case 2:
            e.stopPropagation();
            return true;
        case 3:
            e.preventDefault();
            e.stopPropagation();
            return false;
        default: return true;
    }
}
export function isFlagSet(param, flag) {
    return param && 0 !== (param.flags & flag);
}
/**
 * Returns the param
 */
export function putArgsTo(param, array, i, flags) {
    var l = array.length, k, v;
    param.flags = flags || 3;
    while (i < l) {
        k = array[i++];
        v = array[i++];
        param[k] = k.charAt(0) === '$' || isNaN(v) ? v : parseInt(v, 10);
    }
    return param;
}
export function getFirstVm(el) {
    var vm = el.__vue__;
    if (!vm) {
        el = getFirstChildElement(el);
        vm = el ? el.__vue__ : null;
    }
    return vm;
}
export function getValue(obj, key) {
    /* jshint eqeqeq: false */
    if (key.indexOf('.') < 0) {
        return obj[key];
    }
    var path = key.split('.'), d = -1, l = path.length, container;
    while (++d < l && obj != null) {
        container = obj;
        key = path[d];
        obj = obj[key];
    }
    return container[key];
}
export function vmGetValue(obj, key) {
    var val = getValue(obj, key);
    return val === undefined && obj.$parent
        ? obj.$parent.$get(key)
        : val;
}
export function vmLookup(target, p) {
    var parent = p || target.parentElement, gparent = parent.parentElement, ggparent = gparent.parentElement, gggparent = ggparent.parentElement;
    return target.__vue__ || parent.__vue__ || gparent.__vue__ || ggparent.__vue__ || gggparent.__vue__;
}
export function vmGetHandler(vm) {
    while (!vm.handle)
        vm = vm.$parent;
    return vm.handle;
}
export function setValue(obj, key, value) {
    /* jshint eqeqeq: false */
    if (key.indexOf('.') < 0) {
        obj[key] = value;
        return;
    }
    var path = key.split('.'), d = -1, l = path.length, container;
    while (++d < l && obj != null) {
        container = obj;
        key = path[d];
        obj = obj[key];
    }
    container[key] = value;
}
export function getObjAndKey(obj, key) {
    /* jshint eqeqeq: false */
    if (key.indexOf('.') < 0) {
        return { obj: obj, key: key };
    }
    var path = key.split('.'), d = -1, l = path.length, container;
    while (++d < l && obj != null) {
        container = obj;
        key = path[d];
        obj = obj[key];
    }
    return { obj: container, key: key };
}
export function getObj(obj, key) {
    /* jshint eqeqeq: false */
    if (key.indexOf('.') < 0) {
        return obj;
    }
    var path = key.split('.'), d = -1, l = path.length, container;
    while (++d < l && obj != null) {
        container = obj;
        key = path[d];
        obj = obj[key];
    }
    return container;
}
export function fireEvent(el, type) {
    if (createEvent) {
        var ev = createEvent("HTMLEvents");
        ev.initEvent(type, true, true); // type,bubbling,cancelable
        el.dispatchEvent(ev);
        return;
    }
    if (createEventObject) {
        // IE
        el.fireEvent('on' + type, createEventObject());
        return;
    }
    throw new Error('Could not create an event.');
}
export function prettyDate(ts, targetTimeFormatArray, ago, fromNow) {
    if (ago === void 0) { ago = 'ago'; }
    if (fromNow === void 0) { fromNow = 'from now'; }
    var seconds = (new Date().getTime() - ts) / 1000, token = ago, list_choice = 1, timeFormatArray = targetTimeFormatArray || defaultTimeFormatArray;
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = fromNow;
        list_choice = 2;
    }
    var i = 0, format;
    while (format = timeFormatArray[i++])
        if (seconds < format[0]) {
            if (typeof format[2] === 'number')
                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            return format[list_choice];
        }
    // TODO handle invalid date (out-of-bounds)
    return '' + new Date(ts);
}
/*
    token:     description:             example:
    #YYYY#     4-digit year             1999
    #YY#       2-digit year             99
    #MMMM#     full month name          February
    #MMM#      3-letter month name      Feb
    #MM#       2-digit month number     02
    #M#        month number             2
    #DDDD#     full weekday name        Wednesday
    #DDD#      3-letter weekday name    Wed
    #DD#       2-digit day number       09
    #D#        day number               9
    #th#       day ordinal suffix       nd
    #hhh#      military/24-based hour   17
    #hh#       2-digit hour             05
    #h#        hour                     5
    #mm#       2-digit minute           07
    #m#        minute                   7
    #ss#       2-digit second           09
    #s#        second                   9
    #ampm#     "am" or "pm"             pm
    #AMPM#     "AM" or "PM"             PM
*/
export function formatDate2(date, fmt) {
    var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
    YY = ((YYYY = date.getFullYear()) + "").slice(-2);
    MM = (M = date.getMonth() + 1) < 10 ? ('0' + M) : M;
    MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
    DD = (D = date.getDate()) < 10 ? ('0' + D) : D;
    DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
    fmt = fmt.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);
    h = (hhh = date.getHours());
    if (h == 0)
        h = 24;
    if (h > 12)
        h -= 12;
    hh = h < 10 ? ('0' + h) : h;
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
    mm = (m = date.getMinutes()) < 10 ? ('0' + m) : m;
    ss = (s = date.getSeconds()) < 10 ? ('0' + s) : s;
    return fmt.replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
}
export function toDay(date) {
    return daysArray[date.getDay()];
}
export function toD(date) {
    var buf = '', d = date.getDate();
    if (d < 10)
        buf += '0';
    buf += d;
    return buf;
}
export function toMD(date, separator) {
    var y = '', m = date.getMonth() + 1, d = date.getDate();
    if (m < 10)
        y += '0';
    y = y + m + separator;
    if (d < 10)
        y += '0';
    y += d;
    return y;
}
export function toYM(date, separator) {
    var y = date.getFullYear() + separator, m = date.getMonth() + 1;
    if (m < 10)
        y += '0';
    y = y + m;
    return y;
}
export function toYMD(date, separator) {
    var y = date.getFullYear() + separator, m = date.getMonth() + 1, d = date.getDate();
    if (m < 10)
        y += '0';
    y = y + m + separator;
    if (d < 10)
        y += '0';
    y += d;
    return y;
}
export function toYMDTime(dt, separator) {
    var date = new Date(dt.getTime()), time;
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    time = dt.getTime() - date.getTime();
    return toYMD(date, separator) + ' ' + numeral(Math.floor(time / 1000)).format('00:00:00');
}
export function removeTime(date) {
    date.setHours(0, 0, 0, 0);
    return date;
}
export function formatTime(v) {
    return isNaN(v) ? '' : numeral(v).format('00:00:00');
}
export function formatDate(v) {
    return !v || isNaN(v) ? '' : toYMD(new Date(utcToLocal(v)), '/');
}
export function formatDateTime(v) {
    return !v || isNaN(v) ? '' : toYMDTime(new Date(utcToLocal(v)), '/');
}
export function isValidDateStr(text) {
    if (!regexDate.test(text) || isNaN(Date.parse(text))) {
        return null;
    }
    var y = parseInt(text.substring(0, 4), 10), m = parseInt(text.substring(5, 7), 10), d = parseInt(text.substring(8, 10), 10);
    // Check the ranges of m and y
    if (y < 1000 || y > 3000 || m == 0 || m > 12)
        return null;
    // Adjust for leap ys
    var monthArray = (y % 400 == 0 || (y % 100 != 0 && y % 4 == 0)) ? monthLeapArray : monthRegularArray;
    // Check the range of the d
    return d > 0 && d <= monthArray[m - 1] ? new Date(y, m - 1, d).getTime() : null;
}
export function isValidDateTimeStr(dt) {
    var text = dt.substring(0, 10);
    if (!regexDate.test(text) || isNaN(Date.parse(text))) {
        return null;
    }
    var y = parseInt(text.substring(0, 4), 10), m = parseInt(text.substring(5, 7), 10), d = parseInt(text.substring(8, 10), 10), v;
    // Check the ranges of m and y
    if (y < 1000 || y > 3000 || m == 0 || m > 12)
        return null;
    // Adjust for leap ys
    var monthArray = (y % 400 == 0 || (y % 100 != 0 && y % 4 == 0)) ? monthLeapArray : monthRegularArray;
    // Check the range of the d
    if (d > 0 && d <= monthArray[m - 1] && (v = numeral().unformat(dt.substring(11))) <= 86399)
        return new Date(y, m - 1, d).getTime() + (v * 1000);
    return null;
}
export function getAbsoluteLeft(el) {
    var left = 0, curr = el;
    // This intentionally excludes body which has a null offsetParent.    
    while (curr.offsetParent) {
        left -= curr.scrollLeft;
        curr = curr.parentNode;
    }
    while (el) {
        left += el.offsetLeft;
        el = el.offsetParent;
    }
    return left;
}
export function getAbsoluteTop(el) {
    var top = 0, curr = el;
    // This intentionally excludes body which has a null offsetParent.    
    while (curr.offsetParent) {
        top -= curr.scrollTop;
        curr = curr.parentNode;
    }
    while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
    }
    return top;
}
export function positionTo(relativeTarget, popup) {
    // Calculate left position for the popup. The computation for
    // the left position is bidi-sensitive.
    var offsetWidth = popup.offsetWidth || 0, offsetHeight = popup.offsetHeight || 0, textBoxOffsetWidth = relativeTarget.offsetWidth || 0, 
    // Compute the difference between the popup's width and the
    // textbox's width
    offsetWidthDiff = offsetWidth - textBoxOffsetWidth, left = getAbsoluteLeft(relativeTarget);
    /*if (LocaleInfo.getCurrentLocale().isRTL()) { // RTL case

        var textBoxAbsoluteLeft = relativeTarget.getAbsoluteLeft();

        // Right-align the popup. Note that this computation is
        // valid in the case where offsetWidthDiff is negative.
        left = textBoxAbsoluteLeft - offsetWidthDiff;

        // If the suggestion popup is not as wide as the text box, always
        // align to the right edge of the text box. Otherwise, figure out whether
        // to right-align or left-align the popup.
        if (offsetWidthDiff > 0) {

        // Make sure scrolling is taken into account, since
        // box.getAbsoluteLeft() takes scrolling into account.
        var windowRight = Window.getClientWidth() + Window.getScrollLeft();
        var windowLeft = Window.getScrollLeft();

        // Compute the left value for the right edge of the textbox
        var textBoxLeftValForRightEdge = textBoxAbsoluteLeft
            + textBoxOffsetWidth;

        // Distance from the right edge of the text box to the right edge
        // of the window
        var distanceToWindowRight = windowRight - textBoxLeftValForRightEdge;

        // Distance from the right edge of the text box to the left edge of the
        // window
        var distanceFromWindowLeft = textBoxLeftValForRightEdge - windowLeft;

        // If there is not enough space for the overflow of the popup's
        // width to the right of the text box and there IS enough space for the
        // overflow to the right of the text box, then left-align the popup.
        // However, if there is not enough space on either side, stick with
        // right-alignment.
        if (distanceFromWindowLeft < offsetWidth
            && distanceToWindowRight >= offsetWidthDiff) {
            // Align with the left edge of the text box.
            left = textBoxAbsoluteLeft;
        }
        }
    } else { // LTR case*/
    // Left-align the popup.
    // TODO this was moved to variable initialization
    //left = relativeTarget.getAbsoluteLeft();
    // If the suggestion popup is not as wide as the text box, always align to
    // the left edge of the text box. Otherwise, figure out whether to
    // left-align or right-align the popup.
    if (offsetWidthDiff > 0) {
        // Make sure scrolling is taken into account, since
        // box.getAbsoluteLeft() takes scrolling into account.
        var windowLeft = document['scrollLeft'] || 0, windowRight = windowLeft + (document['clientWidth'] || 0), 
        // Distance from the left edge of the text box to the right edge
        // of the window
        distanceToWindowRight = windowRight - left, 
        // Distance from the left edge of the text box to the left edge of the
        // window
        distanceFromWindowLeft = left - windowLeft;
        // If there is not enough space for the overflow of the popup's
        // width to the right of hte text box, and there IS enough space for the
        // overflow to the left of the text box, then right-align the popup.
        // However, if there is not enough space on either side, then stick with
        // left-alignment.
        if (distanceToWindowRight < offsetWidth && distanceFromWindowLeft >= offsetWidthDiff) {
            // Align with the right edge of the text box.
            left -= offsetWidthDiff;
        }
    }
    //}
    // Calculate top position for the popup
    var top = getAbsoluteTop(relativeTarget), 
    // Make sure scrolling is taken into account, since
    // box.getAbsoluteTop() takes scrolling into account.
    windowTop = document.documentElement.scrollTop || 0, windowBottom = windowTop + document.documentElement.clientHeight, 
    // Distance from the top edge of the window to the top edge of the
    // text box
    distanceFromWindowTop = top - windowTop, 
    // Distance from the bottom edge of the window to the bottom edge of
    // the text box
    rtOffsetHeight = relativeTarget.offsetHeight || 0, distanceToWindowBottom = windowBottom - (top + rtOffsetHeight);
    // If there is not enough space for the popup's height below the text
    // box and there IS enough space for the popup's height above the text
    // box, then then position the popup above the text box. However, if there
    // is not enough space on either side, then stick with displaying the
    // popup below the text box.
    if (distanceToWindowBottom < offsetHeight && distanceFromWindowTop >= offsetHeight) {
        top -= offsetHeight;
    }
    else {
        // Position above the text box
        top += rtOffsetHeight;
    }
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
}
export function popTo(relativeTarget, popup) {
    popup.style.visibility = 'hidden';
    positionTo(relativeTarget, popup);
    popup.style.visibility = 'visible';
}
export function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
export function newTrie(stem, sorting) {
    return new Trie(stem, sorting);
}
/*var modalId
export const popup = document.getElementById('popup')
export function handle(type) {
    if (modalId) {
        document.modalId = modalId
        modalId = null
    }
    return false
}
export const handlerObj = { handle: handle }

export function deactivate() {
    var el = document.getElementById(document.modalId)
    document.modalId = null
    
    if(el) {
        removeClass(el, 'active')
        var prev = el.previousElementSibling
        if (prev && el.className === 'modal' && prev.className === 'modal-close') {
            fireEvent(prev, 'click')
        } else {
            var vm = el.__vue__ || getFirstVm(el)
            if(vm && vm.handle(2)) vm.$broadcast('vui', 2)
        }
    }
}
export function hidePopup(conditional): boolean {
    if (conditional && document.modalId !== 'popup') return false
    
    popup.style.visibility = 'hidden'
    removeClass(popup, 'active')
    
    document.modalId = modalId
    modalId = null
    
    return true
}
export function showPopup(el, elTo) {
    popup.replaceChild(el, popup.firstChild)
    addClass(popup, 'active')
    util.popTo(elTo || el, popup)
    
    if (document.modalId !== 'popup') {
        modalId = document.modalId
        document.modalId = 'popup'
    }
}
export function togglePopup(el, elTo): boolean {
    if (document.modalId === 'popup') return !hidePopup()
    
    showPopup(el, elTo)
    return true
}
export function isPopupShown(): boolean {
    return document.modalId === 'popup'
}

document.addEventListener('keyup', function(e) {
    if (e.keyCode === 27 && document.modalId) util.deactivate()
})

document.addEventListener('click', function(e) {
    if (!document.modalId) return
    
    var el = e.target
    if (el.className === 'modal active' ||
        (document.modalId === 'popup' && !el.$with_popup && el.tagName !== 'SELECT')) {
        util.deactivate()
    }
})*/
//# sourceMappingURL=util.js.map