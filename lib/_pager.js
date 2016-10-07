var Hammer = require('hammerjs');
import * as keymage from './keymage';
import { screen, table_compact_columns } from './screen_util';
import { isInput, resolveElement, fireEvent, removeClass } from './dom_util';
import { listUp, listDown, tableUp, tableDown, moveTopOrUp, moveBottomOrDown, moveLeft, moveRight, pageFirst, pageLast, pageSort, pageReload, pageNextOrLoad, pagePrevOrLoad } from './pager_util';
import { defp } from 'vueds';
/**
 * Add the property 'pager_opts' to el.
 */
export function attachOptsTo(el, args, pager, vm) {
    var i = 0, len = !args ? 0 : args.length, flags = i === len ? 0 : parseInt(args[i++], 10), table_flags = i === len ? 0 : parseInt(args[i++], 10), col_size = i === len ? (table_flags === 0 ? 0 : table_compact_columns()) : parseInt(args[i++], 10), hammer = new Hammer(el);
    var opts = {
        flags: flags,
        col_size: col_size,
        table_flags: table_flags,
        pager: pager,
        hammer: hammer,
        vm: vm,
        el: el,
        //pageLeft: null,
        //pageRight: null,
        focus: null
    };
    configureHammer(hammer, opts);
    //if (el.id)
    //    addCustomListenersTo(el, opts)
    el.addEventListener('focusin', opts.focus = focus.bind(opts), true);
    defp(el, 'pager_opts', opts);
}
function configureHammer(hammer, opts) {
    hammer.get('swipe').set({ velocity: 0.1 /*, distance: 1*/ });
    if (!(opts.flags & 16 /* SUGGEST */)) {
        //hammer.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) )
        //hammer.get('doubletap').recognizeWith('tap')
        hammer.on('doubletap', doubletap.bind(opts));
        hammer.on('press', press.bind(opts));
    }
    hammer.on('swipe', swipe.bind(opts));
    hammer.on('tap', tap.bind(opts));
}
/*function addCustomListenersTo(el, opts: Opts) {
    let pageLeft = (e) => { current = opts; pagePrevOrLoad(e, opts.pager, opts); },
        pageRight = (e) => { current = opts; pageNextOrLoad(e, opts.pager, opts); }
    
    el.addEventListener('page-left', opts.pageLeft = pageLeft)
    el.addEventListener('page-right', opts.pageRight = pageRight)
}*/
export function cleanup(opts) {
    var el = opts.el;
    el.removeEventListener('focusin', opts.focus);
    opts.hammer.destroy();
    //if (!opts.pageLeft) return
    //el.removeEventListener('page-left', opts.pageLeft)
    //el.removeEventListener('page-right', opts.pageRight)
}
function itemLookup(target, p) {
    var parent = p || target.parentElement, gparent = parent.parentElement, ggparent = gparent.parentElement, gggparent = ggparent.parentElement;
    return target.pager_item || parent.pager_item || gparent.pager_item || ggparent.pager_item || gggparent.pager_item;
}
var current;
function moveUp(e) {
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
function moveDown(e) {
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
function select(e, opts, dbltap, flagsIntersect) {
    var target = e.target, parent = target.parentElement, pojo, store, trigger = target.getAttribute('dtap') || (target = parent).getAttribute('dtap');
    if (trigger)
        fireEvent(target, 'dtap');
    if (!(pojo = itemLookup(target)) || pojo.$pager !== opts.pager)
        return;
    store = opts.pager['store'];
    if (flagsIntersect) {
        if (!(pojo.vstate & 16 /* UPDATE */)) {
            pojo.vstate |= 16 /* UPDATE */;
            store.select(pojo, 4 /* CLICKED_UPDATE */, pojo.$index);
        }
    }
    else if (dbltap && trigger) {
        store.select(pojo, 1 /* CLICKED */, pojo.$index);
    }
    else {
        pojo.vstate ^= 16 /* UPDATE */;
        store.select(pojo, 4 /* CLICKED_UPDATE */, pojo.$index);
    }
}
// =====================================
// context listeners
function focus(e) {
    current = this;
    keymage.setScope('pager');
}
function swipe(e) {
    var self = this, target = e.target, pojo;
    if (isInput(target))
        return;
    current = self;
    keymage.setScope('pager');
    if (!(pojo = itemLookup(target)) || pojo.$pager !== self.pager)
        return;
    switch (e.direction) {
        case 2:
            pageNextOrLoad(e, self.pager, self);
            break;
        case 4:
            pagePrevOrLoad(e, self.pager, self);
            break;
    }
}
function press(e) {
    if (isInput(e.target))
        return;
    current = this;
    keymage.setScope('pager');
    select(e, this, false, this.flags & screen.flags);
}
function tap(e) {
    var self = this;
    current = self;
    if (isInput(e.target))
        return;
    keymage.setScope('pager');
    if (self.flags & screen.flags) {
        select(e, self, false, 1);
        return;
    }
    var pager = self.pager, pojo, store, 
    //key,
    suggest;
    if (!(pojo = itemLookup(e.target)) || pojo.$pager !== pager)
        return;
    store = self.pager['store'];
    //key = pojo[store.$k] || pojo[store.k]
    suggest = !!(self.flags & 16 /* SUGGEST */);
    if (!suggest && pager.array[pojo.$index] === pager.pojo /* && pager.prev_key === key*/)
        return;
    store.select(pojo, 1 /* CLICKED */, pojo.$index);
    if (suggest)
        removeClass(self.el.parentElement, 'active');
}
function doubletap(e) {
    var flags = this.flags, target = e.target;
    current = this;
    if (isInput(target) || (!(flags & 32 /* DTAP_ANY */) && target.tagName !== 'DD'))
        return;
    select(e, this, true, flags & screen.flags);
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