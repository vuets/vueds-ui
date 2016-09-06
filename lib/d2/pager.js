import { focus, putArgsTo, configureHammer, addCustomListenersTo } from '../_pager';
var Hammer = require('hammerjs');
export function bind(el, dir, vnode) {
    var arg = dir.arg, hammer = new Hammer(el), opts; //: Opts
    opts = {
        v2: true,
        flags: 0,
        col_size: 0,
        table_flags: 0,
        hammer: hammer,
        pager: null,
        vm: vnode.context,
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
export function update(el, _a, vnode) {
    var value = _a.value;
    var opts = el.pager_opts;
    if (opts.pager !== value)
        opts.pager = value;
}
export function unbind(el, dir, vnode) {
    var opts = el.pager_opts;
    el.removeEventListener('focusin', opts.focus);
    opts.hammer.destroy();
    if (opts.unbind)
        opts.unbind();
}
//# sourceMappingURL=pager.js.map