import { parseOpts, cleanup } from '../_dpicker';
export function update(value, oldValue) {
    if (oldValue)
        return;
    if (value && value.pojo && value.field)
        this.dpicker = parseOpts(this.arg && this.arg.split(','), value.pojo, value.field, this.el);
    else
        console.warn('v-dpicker requires the value: { pojo: obj, field: string }');
}
export function unbind() {
    var dpicker = this.dpicker;
    if (dpicker)
        cleanup(dpicker);
}
//# sourceMappingURL=dpicker.js.map