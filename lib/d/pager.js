import { screen, table_compact_columns } from '../screen_util';
import { isInput, resolveElement, fireEvent } from '../dom_util';
import { selectIdx, pageAndSelectIdx, tableUp, tableDown, tableLeft, tableRight, tableJumpUp, tableJumpDown, tableJumpLeft, tableJumpRight } from '../pager_util';
import { vfragLookup } from '../vm_util';
import { resolveNextPageIndex } from 'vueds/lib/store/';
import * as keymage from '../keymage';
var Hammer = require('hammerjs'), current;
function _moveUp(pager, index_selected, e, clickUpdate) {
    e.preventDefault();
    var array = pager.array;
    var index_hidden, pojo;
    if (index_selected === -1) {
        index_hidden = pager.index_hidden;
        // select the visible item at the bottom (last)
        if (index_hidden)
            selectIdx(index_hidden - 1, array, pager['store'], clickUpdate);
    }
    else if (!pager.page) {
        if (index_selected)
            selectIdx(index_selected - 1, array, pager['store'], clickUpdate);
    }
    else if (index_selected) {
        selectIdx(index_selected - 1, array, pager['store'], clickUpdate);
    }
    else {
        // move to previous page and select the last element
        pageAndSelectIdx(--pager.page, array.length - 1, array, pager['store'], clickUpdate);
    }
    // TODO focus item when not visible on view
    //current.vm.$.repeat[index_selected].$el.focus()
}
function _moveDown(pager, index_selected, e, clickUpdate) {
    e.preventDefault();
    var array = pager.array;
    if (pager.page < pager.page_count) {
        if (index_selected === (array.length - 1)) {
            // move to next page and select the first element
            pageAndSelectIdx(++pager.page, 0, array, pager['store'], clickUpdate);
        }
        else {
            selectIdx(index_selected + 1, array, pager['store'], clickUpdate);
        }
    }
    else if (pager.index_hidden - 1 > index_selected) {
        selectIdx(index_selected + 1, array, pager['store'], clickUpdate);
    }
}
function moveUp(e) {
    var target = e.target, attr = target.getAttribute('c-list'), pager, clickUpdate;
    if (attr && !(current = target.list_ctrl)) {
        target.list_ctrl = current = resolveElement(target, attr).list_ctrl;
    }
    if (!current || !(pager = current.pager).index_hidden)
        return;
    clickUpdate = !!(current.$flags & screen.flags);
    if (current.col_size)
        tableUp(pager, current.col_size, current.table_flags, pager.index_selected, e, clickUpdate);
    else
        _moveUp(pager, pager.index_selected, e, clickUpdate);
}
function moveDown(e) {
    var target = e.target, attr = target.getAttribute('c-list'), pager, toAdd;
    if (attr && !(current = target.list_ctrl)) {
        target.list_ctrl = current = resolveElement(target, attr).list_ctrl;
    }
    if (!current || !(pager = current.pager).index_hidden)
        return;
    toAdd = current.$flags & screen.flags ? 10 : 0;
    if (current.col_size)
        tableDown(pager, current.col_size, current.table_flags, pager.index_selected, e, toAdd);
    else
        _moveDown(pager, pager.index_selected, e, toAdd);
}
function moveTopOrUp(e) {
    var pager;
    if (!current || !(pager = current.pager).index_hidden)
        return;
    if (current.col_size) {
        tableJumpUp(pager, current.col_size, current.table_flags, pager.index_selected, e, !!(current.$flags & screen.flags));
        return;
    }
    var index_selected = pager.index_selected, clickUpdate = !!(current.$flags & screen.flags);
    if (!index_selected)
        _moveUp(pager, index_selected, e, clickUpdate);
    else
        selectIdx(0, pager.array, pager.store, clickUpdate);
}
function moveBottomOrDown(e) {
    var pager;
    if (!current || !(pager = current.pager).index_hidden)
        return;
    if (current.col_size) {
        tableJumpDown(pager, current.col_size, current.table_flags, pager.index_selected, e, !!(current.$flags & screen.flags));
        return;
    }
    var index_selected = pager.index_selected, index_hidden = pager.index_hidden, clickUpdate = !!(current.$flags & screen.flags);
    if (index_selected === index_hidden - 1)
        _moveDown(pager, index_selected, e, clickUpdate);
    else
        selectIdx(index_hidden - 1, pager.array, pager.store, clickUpdate);
}
function pageFirst(e) {
    if (!current)
        return;
    var pager = current.pager;
    if (current.col_size) {
        if (pager.index_hidden) {
            tableJumpLeft(pager, current.col_size, current.table_flags, pager.index_selected, e, !!(current.$flags & screen.flags));
        }
        return;
    }
    if (!pager.page)
        return;
    e.preventDefault();
    var store = pager['store'];
    pager.page = 0;
    if (current.$flags & 16) {
        pageAndSelectIdx(0, pager.index_selected, pager.array, store, false);
    }
    else {
        store.repaint();
    }
}
function pageLast(e) {
    if (!current)
        return;
    var pager = current.pager;
    if (current.col_size) {
        if (pager.index_hidden) {
            tableJumpRight(pager, current.col_size, current.table_flags, pager.index_selected, e, !!(current.$flags & screen.flags));
        }
        return;
    }
    if (pager.page === pager.page_count)
        return;
    e.preventDefault();
    var store = pager['store'], page = pager.page_count;
    pager.page = page;
    if (current.$flags & 16) {
        pageAndSelectIdx(page, Math.min(pager.index_selected, (pager.size % pager.array.length) - 1), pager.array, store, false);
    }
    else {
        store.repaint();
    }
}
function pageSort(e) {
    var pager;
    if (!current || (pager = current.pager).state & 8 /* LOADING */ || !pager.index_hidden)
        return;
    e.preventDefault();
    pager.state ^= 16 /* DESC */;
    pager.store.repaint();
}
function pageNewer(e) {
    var pager;
    if (!current || (pager = current.pager).state & 264 /* MASK_RPC_DISABLE */)
        return;
    e.preventDefault();
    pager.store.requestNewer();
}
function pageOlder(e) {
    var pager;
    if (!current || (pager = current.pager).state & 264 /* MASK_RPC_DISABLE */ || !pager.index_hidden)
        return;
    e.preventDefault();
    pager.store.requestOlder();
}
function pageReload(e) {
    var pager;
    if (!current || current.$flags & 8 || (pager = current.pager).state & 264 /* MASK_RPC_DISABLE */ ||
        !pager.index_hidden)
        return;
    e.preventDefault();
    pager.store.reload();
}
function pagePrevOrLoad(pager, e) {
    if (pager.page) {
        // goto previous
        e.preventDefault();
        var page = --pager.page;
        if (current.$flags & 16) {
            pageAndSelectIdx(page, pager.index_selected, pager.array, pager.store, false);
        }
        else {
            pager.store.repaint();
        }
        return;
    }
    // page unshift
    if ((current.$flags & 1) || (pager.state & 264 /* MASK_RPC_DISABLE */))
        return;
    if (pager.state & 16 /* DESC */) {
        e.preventDefault();
        pager.store.requestNewer();
    }
    else if (pager.index_hidden) {
        // only allow load older if store is not empty
        e.preventDefault();
        pager.store.requestOlder();
    }
}
function pageNextOrLoad(pager, e) {
    var store = pager['store'], page = pager.page;
    if (page < pager.page_count) {
        // goto next
        e.preventDefault();
        page = ++pager.page;
        if (0 === (current.$flags & 16)) {
            store.repaint();
            return;
        }
        pageAndSelectIdx(page, resolveNextPageIndex(page, pager.index_selected, pager), pager.array, store, false);
        return;
    }
    var state = pager.state;
    // page push
    if ((current.$flags & 1) || (state & 264 /* MASK_RPC_DISABLE */) || !pager.index_hidden)
        return;
    e.preventDefault();
    if (state & 16 /* DESC */)
        store.requestOlder();
    else
        store.requestNewer();
}
function moveLeft(e) {
    if (!current)
        return;
    var pager = current.pager;
    if (!current.col_size) {
        pagePrevOrLoad(pager, e);
    }
    else if (pager.index_hidden) {
        tableLeft(pager, current.col_size, current.table_flags, pager.index_selected, e, !!(current.$flags & screen.flags));
    }
}
function moveRight(e) {
    if (!current)
        return;
    var pager = current.pager;
    if (!current.col_size) {
        pageNextOrLoad(pager, e);
    }
    else if (pager.index_hidden) {
        tableRight(pager, current.col_size, current.table_flags, pager.index_selected, e, !!(current.$flags & screen.flags));
    }
}
/*var moveTop = function(e) {
        var pager
        if (!current || !(pager = current.pager).index_hidden || !pager.index_selected) return
        
        var toAdd = current.$flags & screen.flags ? 10 : 0
        pager.$handle(8 + toAdd, 0)
    },
    moveBottom = function(e) {
        var pager
        if (!current || !(pager = current.pager).index_hidden || pager.index_selected === pager.index_hidden - 1) return
        
        var toAdd = current.$flags & screen.flags ? 10 : 0
        pager.$handle(8 + toAdd, pager.index_hidden - 1)
    },*/
/*pagePrev = function(e) {
    var pager
    if (!current || !(pager = current.pager).page) return
    
    e.preventDefault()
    pager.page--
    //pager.$handle(9, 0)
    if (current.$flags & 16) {
        pager.$handle(9, pager.index_selected)
    } else {
        pager.$handle(1)
    }
},
pageNext = function(e) {
    var pager
    if (!current || (pager = current.pager).page === pager.page_count) return
    
    e.preventDefault()
    pager.page++
    //pager.$handle(9, 0)
    if (current.$flags & 16) {
        pager.$handle(9, util.resolveNextPageIndex(pager, pager.index_selected))
    } else {
        pager.$handle(1)
    }
},*/
/*pageUnshift = function(e) {
    var pager
    if (!current || (pager = current.pager).state & c.MASK_RPC_DISABLE) return
    
    if (pager.state & c.STATE_DESC) {
        e.preventDefault()
        pager.$handle(2)
    } else if (pager.index_hidden) {
        // only allow load older if store is not empty
        e.preventDefault()
        pager.$handle(3)
    }
    
    //e.preventDefault()
    //pager.$handle(pager.state & c.STATE_DESC ? 2 : 3)
},
pagePush = function(e) {
    var pager
    if (!current || (pager = current.pager).state & c.MASK_RPC_DISABLE || !pager.index_hidden) return
    
    e.preventDefault()
    pager.$handle(pager.state & c.STATE_DESC ? 3 : 2)
},*/
/*,
actions = {
    '@': function(el) {
        util.fireEvent(el, 'click')
    },
    '!': util.toggleActive
},
actionNew = function(e) {
    var am // action mapping
    if (!current || !(am = current.am) || !am.n) return
    
    actions[am.n.fn_key](document.getElementById(am.n.id))
}*/
keymage.$('list', 'up', moveUp);
keymage.$('list', 'down', moveDown);
keymage.$('list', 'defmod-up', moveTopOrUp);
keymage.$('list', 'defmod-down', moveBottomOrDown);
//keymage.$('list', 'left', pagePrev)
//keymage.$('list', 'right', pageNext)
keymage.$('list', ['left', 'shift-up'], moveLeft);
keymage.$('list', ['right', 'shift-down'], moveRight);
keymage.$('list', ['defmod-left', 'defmod-shift-up'], pageFirst);
keymage.$('list', ['defmod-right', 'defmod-shift-down'], pageLast);
keymage.$('list', 'shift-space', pageSort);
//keymage.$('list', '[', pageNewer)
//keymage.$('list', ']', pageOlder)
keymage.$('list', 'defmod-space', pageReload);
//keymage.$('list', 'defmod-shift-down', pageUnshift)
//keymage.$('list', 'defmod-shift-up', pagePush)
// extra bindings for actions configured via directive args
//keymage.$('list', 'alt-shift-n', actionNew)
/*module.exports = {
    $flags: 0,
    col_size: 0,
    table_flags: 0,
    pager: null,
    */
export function bind() {
    var self = this, el = self.el, hammer;
    el.list_ctrl = self;
    if (el.id) {
        el.addEventListener('page-left', function (e) { current = self; pagePrevOrLoad(self.pager, e); });
        el.addEventListener('page-right', function (e) { current = self; pageNextOrLoad(self.pager, e); });
    }
    // TODO proper focus support
    this._focus = function (e) {
        current = self;
        keymage.setScope('list');
    };
    el.addEventListener('focusin', this._focus, true);
    //el.addEventListener('click', this._focus, true)
    self.hammer = hammer = new Hammer(el);
    hammer.get('swipe').set({ velocity: 0.1, distance: 1 });
    hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    hammer.get('doubletap').recognizeWith('tap');
    this._swipe = function (e) {
        var target = e.target, vfrag, vm;
        if (isInput(target))
            return;
        current = self;
        keymage.setScope('list');
        vfrag = vfragLookup(target);
        if (!vfrag || !(vm = vfrag.scope) || !vm.hasOwnProperty('$index') || (vm !== self.vm && vm.$parent !== self.vm))
            return;
        switch (e.direction) {
            case 2:
                pageNextOrLoad(self.pager, e);
                break;
            case 4:
                pagePrevOrLoad(self.pager, e);
                break;
        }
    };
    this._dtap = function (e, dbltap, flagsIntersect) {
        var target = e.target, parent = target.parentElement, vfrag = vfragLookup(target, parent), vm, trigger = target.getAttribute('dtap') || (target = parent).getAttribute('dtap');
        if (trigger)
            fireEvent(target, 'dtap');
        if (!vfrag || !(vm = vfrag.scope) || !vm.hasOwnProperty('$index') || (vm !== self.vm && vm.$parent !== self.vm))
            return;
        //if (vm.$parent.$data.pager !== self.pager && (!(vm=vm.$parent).$parent || vm.$parent.$data.pager !== self.pager)) return
        var pojo = vm[self.loop_var];
        if (!pojo)
            return;
        if (flagsIntersect) {
            if (!(pojo.vstate & 16 /* UPDATE */)) {
                pojo.vstate |= 16 /* UPDATE */;
                self.pager.store.select(pojo, 3 /* CLICKED_UPDATE */, pojo.$index);
            }
        }
        else if (dbltap && trigger) {
            self.pager.store.select(pojo, 1 /* CLICKED */, pojo.$index);
        }
        else {
            pojo.vstate ^= 16 /* UPDATE */;
            self.pager.store.select(pojo, 3 /* CLICKED_UPDATE */, pojo.$index);
        }
    };
    this._press = function (e, dbltap) {
        current = self;
        if (isInput(e.target))
            return;
        keymage.setScope('list');
        self._dtap(e, false, self.$flags & screen.flags);
    };
    this._tap = function (e) {
        current = self;
        if (isInput(e.target))
            return;
        keymage.setScope('list');
        if (self.$flags & screen.flags) {
            self._dtap(e, false, true);
            return;
        }
        var vfrag = vfragLookup(e.target), vm;
        if (!vfrag || !(vm = vfrag.scope) || !vm.hasOwnProperty('$index') || (vm !== self.vm && vm.$parent !== self.vm))
            return;
        //if (vm.$parent.$data.pager !== self.pager && (!(vm=vm.$parent).$parent || vm.$parent.$data.pager !== self.pager)) return
        var pojo = vm[self.loop_var];
        if (pojo)
            self.pager.store.select(pojo, 1 /* CLICKED */, pojo.$index);
    };
    this._doubletap = function (e) {
        // TODO remove hack
        if (e.target.hasOwnProperty('$l')) {
            // a date input with a date picker
            // workaround for mobile
            fireEvent(e.target, 'dblclick');
            e.preventDefault();
            //e.stopPropagation()
            return false;
        }
        current = self;
        if (isInput(e.target))
            return;
        // tap already handles this, which gets called before this function
        // keymage.setScope('list')
        self._dtap(e, true, self.$flags & screen.flags);
    };
    hammer.on('swipe', this._swipe);
    hammer.on('press', this._press);
    hammer.on('tap', this._tap);
    hammer.on('doubletap', this._doubletap);
    if (!self.arg) {
        this.loop_var = 'pojo';
        return;
    }
    var split_args = self.arg.split('__'), len = split_args.length, i = 0;
    this.loop_var = split_args[i++];
    self.$flags = parseInt(split_args[i++], 10);
    if (i === len)
        return;
    self.table_flags = parseInt(split_args[i++], 10);
    self.col_size = table_compact_columns();
}
export function update(value, oldValue) {
    if (this.pager !== value)
        this.pager = value;
}
export function unbind() {
    this.el.removeEventListener('focusin', this._focus);
    //this.el.removeEventListener('click', this._focus)
    //this.hammer.off('swipe', this._swipe)
    //this.hammer.off('press', this._press)
    this.hammer.destroy();
}
//# sourceMappingURL=pager.js.map