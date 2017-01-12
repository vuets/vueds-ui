import { isIE9 } from './dom_util';
import { formatDate, formatTime, formatDateTime } from 'vueds/lib/datetime_util';
export function updateSelect(el, value) {
    // 0 is treated as null (not set).  The first value of enums should at least be 1.
    var v = value ? value.toString() : '';
    if (!isIE9) {
        el.value = v;
        return;
    }
    el.selectedIndex = -1;
    for (var _i = 0, _a = el.options; _i < _a.length; _i++) {
        var o = _a[_i];
        if (o.value === v) {
            o.selected = true;
            break;
        }
    }
}
export function updateBoolCheckbox(el, value) {
    el.checked = !!value;
}
export function updateBoolSelect(el, value) {
    if (value === null)
        el.selectedIndex = 0;
    else
        updateSelect(el, value ? '1' : '0');
}
export function updateTime(el, value) {
    el.value = !value ? '' : formatTime(value);
}
export function updateDate(el, value) {
    el.value = !value ? '' : formatDate(value);
}
export function updateDateTime(el, value) {
    el.value = !value ? '' : formatDateTime(value);
}
export function updateString(el, value) {
    // TODO escape value
    el.value = value;
}
export function updateNumber(el, value) {
    el.value = value || value === 0 ? value.toString() : '';
    // only write '0' if the input field was not empty (not initial state)
    //if (value || el.value)
    //    el.value = value
}
export function getFnUpdate(el, type, flags) {
    if (type === 1 /* BOOL */)
        return el.nodeName === 'SELECT' ? updateBoolSelect : updateBoolCheckbox;
    if (type === 16 /* ENUM */)
        return updateSelect;
    if (type === 3 /* STRING */)
        return updateString;
    switch (flags) {
        case 1: return updateTime;
        case 2: return updateDate;
        case 4: return updateDateTime;
        default: return updateNumber;
    }
}
//# sourceMappingURL=field_util.js.map