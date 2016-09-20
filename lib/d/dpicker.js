import { parseOpts, cleanup } from '../_dpicker';
export function update(value, oldValue) {
    if (oldValue)
        return;
    if (value && value.pojo && value.field)
        this.calendar = parseOpts(this.arg && this.arg.split(','), value.pojo, value.field, this.el);
    else
        console.warn('Must provide value: { pojo: obj, field: string }');
}
export function unbind() {
    var calendar = this.calendar;
    if (calendar)
        cleanup(calendar);
}
//# sourceMappingURL=dpicker.js.map