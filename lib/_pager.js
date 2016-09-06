// common dependency for d/pager and d2/pager
import * as keymage from './keymage';
import { screen, table_compact_columns } from './screen_util';
import { isInput, resolveElement, fireEvent } from './dom_util';
import { listUp, listDown, tableUp, tableDown, moveTopOrUp, moveBottomOrDown, moveLeft, moveRight, pageFirst, pageLast, pageSort, pageReload, pageNextOrLoad, pagePrevOrLoad } from './pager_util';
export function itemLookup(target, p) {
    var parent = p || target.parentElement, gparent = parent.parentElement, ggparent = gparent.parentElement, gggparent = ggparent.parentElement;
    return target.pager_item || parent.pager_item || gparent.pager_item || ggparent.pager_item || gggparent.pager_item;
}
var current;
export function moveUp(e) {
    var target = e.target, attr = target.getAttribute('c-list'), pager, clickUpdate;
    if (attr && !(current = target.pager_opts)) {
        target.pager_opts = current = resolveElement(target, attr).pager_opts;
    }
    if (!current || !(pager = current.pager).index_hidden)
        return;
    clickUpdate = !!(current.flags & screen.flags);
    if (current.col_size)
        tableUp(pager, current.col_size, current.table_flags, pager.index_selected, e, clickUpdate);
    else
        listUp(pager, pager.index_selected, e, clickUpdate);
}
export function moveDown(e) {
    var target = e.target, attr = target.getAttribute('c-list'), pager, clickUpdate;
    if (attr && !(current = target.pager_opts)) {
        target.pager_opts = current = resolveElement(target, attr).pager_opts;
    }
    if (!current || !(pager = current.pager).index_hidden)
        return;
    clickUpdate = !!(current.flags & screen.flags);
    if (current.col_size)
        tableDown(pager, current.col_size, current.table_flags, pager.index_selected, e, clickUpdate);
    else
        listDown(pager, pager.index_selected, e, clickUpdate);
}
export function focus(e, opts) {
    current = opts;
    keymage.setScope('pager');
}
export function swipe(e, opts) {
    var target = e.target, pojo;
    if (isInput(target))
        return;
    current = opts;
    keymage.setScope('pager');
    if (!(pojo = itemLookup(target)) || pojo.$pager !== opts.pager)
        return;
    switch (e.direction) {
        case 2:
            pageNextOrLoad(e, opts.pager, opts);
            break;
        case 4:
            pagePrevOrLoad(e, opts.pager, opts);
            break;
    }
}
export function select(e, opts, dbltap, flagsIntersect) {
    var target = e.target, parent = target.parentElement, pojo, store, trigger = target.getAttribute('dtap') || (target = parent).getAttribute('dtap');
    if (trigger)
        fireEvent(target, 'dtap');
    if (!(pojo = itemLookup(target)) || pojo.$pager !== opts.pager)
        return;
    store = opts.pager['store'];
    if (flagsIntersect) {
        if (!(pojo.vstate & 16 /* UPDATE */)) {
            pojo.vstate |= 16 /* UPDATE */;
            store.select(pojo, 3 /* CLICKED_UPDATE */, pojo.$index);
        }
    }
    else if (dbltap && trigger) {
        store.select(pojo, 1 /* CLICKED */, pojo.$index);
    }
    else {
        pojo.vstate ^= 16 /* UPDATE */;
        store.select(pojo, 3 /* CLICKED_UPDATE */, pojo.$index);
    }
}
export function press(e, opts) {
    current = opts;
    if (isInput(e.target))
        return;
    keymage.setScope('pager');
    select(e, opts, false, opts.flags & screen.flags);
}
export function tap(e, opts) {
    current = opts;
    if (isInput(e.target))
        return;
    keymage.setScope('pager');
    if (opts.flags & screen.flags) {
        select(e, opts, false, 1);
        return;
    }
    var pojo, store;
    if (!(pojo = itemLookup(e.target)) || pojo.$pager !== opts.pager)
        return;
    store = opts.pager['store'];
    store.select(pojo, 1 /* CLICKED */, pojo.$index);
}
export function doubletap(e, opts) {
    // TODO remove hack
    if (e.target.hasOwnProperty('$l')) {
        // a date input with a date picker
        // workaround for mobile
        fireEvent(e.target, 'dblclick');
        e.preventDefault();
        //e.stopPropagation()
        return false;
    }
    current = opts;
    if (isInput(e.target))
        return;
    // tap already handles this, which gets called before this function
    // keymage.setScope('pager')
    select(e, opts, true, opts.flags & screen.flags);
}
/**
 * ```{flags}__{table_flags?}```
 */
export function putArgsTo(opts, split_args) {
    var i = 0, len = split_args.length;
    opts.flags = parseInt(split_args[i++], 10);
    if (i === len)
        return;
    opts.table_flags = parseInt(split_args[i++], 10);
    opts.col_size = table_compact_columns();
}
export function addCustomListenersTo(el, opts) {
    var pageLeft = function (e) { current = opts; pagePrevOrLoad(e, opts.pager, opts); }, pageRight = function (e) { current = opts; pageNextOrLoad(e, opts.pager, opts); };
    el.addEventListener('page-left', pageLeft);
    el.addEventListener('page-right', pageRight);
    opts['unbind'] = function () {
        el.removeEventListener('page-left', pageLeft);
        el.removeEventListener('page-right', pageRight);
    };
}
export function configureHammer(hammer, opts) {
    hammer.get('swipe').set({ velocity: 0.1 /*, distance: 1*/ });
    hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    hammer.get('doubletap').recognizeWith('tap');
    hammer.on('swipe', function (e) { return swipe(e, opts); });
    hammer.on('press', function (e) { return press(e, opts); });
    hammer.on('tap', function (e) { return tap(e, opts); });
    hammer.on('doubletap', function (e) { return doubletap(e, opts); });
}
// =====================================
// key bindings
keymage.$('pager', 'up', moveUp);
keymage.$('pager', 'down', moveDown);
keymage.$('pager', 'defmod-up', function (e) { if (current)
    moveTopOrUp(e, current.pager, current); });
keymage.$('pager', 'defmod-down', function (e) { if (current)
    moveBottomOrDown(e, current.pager, current); });
keymage.$('pager', ['left', 'shift-up'], function (e) { if (current)
    moveLeft(e, current.pager, current); });
keymage.$('pager', ['right', 'shift-down'], function (e) { if (current)
    moveRight(e, current.pager, current); });
keymage.$('pager', ['defmod-left', 'defmod-shift-up'], function (e) { if (current)
    pageFirst(e, current.pager, current); });
keymage.$('pager', ['defmod-right', 'defmod-shift-down'], function (e) { if (current)
    pageLast(e, current.pager, current); });
keymage.$('pager', 'shift-space', function (e) { if (current)
    pageSort(e, current.pager, current); });
keymage.$('pager', 'defmod-space', function (e) { if (current)
    pageReload(e, current.pager, current); });
//# sourceMappingURL=_pager.js.map