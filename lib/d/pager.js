import { focus, putArgsTo, addCustomListenersTo, configureHammer } from '../_pager';
var Hammer = require('hammerjs');
export function bind() {
    var el = this.el, arg = this.arg, hammer = new Hammer(el), opts; //: Opts
    this.opts = opts = {
        flags: 0,
        col_size: 0,
        table_flags: 0,
        hammer: hammer,
        pager: null,
        vm: this.vm,
        focus: function (e) { return focus(e, opts); }
    };
    el.pager_opts = opts;
    if (arg)
        putArgsTo(opts, arg.split(','));
    // TODO proper focus support
    el.addEventListener('focusin', opts.focus, true);
    configureHammer(hammer, opts);
    if (el.id)
        addCustomListenersTo(el, opts);
}
export function update(value, oldValue) {
    var opts = this.opts;
    if (opts.pager !== value)
        opts.pager = value;
}
export function unbind() {
    var opts = this.opts;
    this.el.removeEventListener('focusin', opts.focus);
    opts.hammer.destroy();
    if (opts.unbind)
        opts.unbind();
}
//# sourceMappingURL=pager.js.map