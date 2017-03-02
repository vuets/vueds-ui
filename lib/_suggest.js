import { nextTick } from 'vueds';
import { ds } from 'vueds/lib/ds/';
import * as rpc from 'vueds/lib/rpc/';
//import * as keymage from './keymage'
import { getInstance } from './c/suggest';
import { removeClass, addClass, debounce, getPopup, hidePopup, showPopup, visiblePopup } from './dom_util';
import { pageFirst, pageLast, pagePrevOrLoad, pageNextOrLoad, listDown, listUp, moveTopOrUp, moveBottomOrDown } from './pager_util';
function showSuggest(suggest, self, popup) {
    suggest.pstore.replace(self.cache, 1 /* RESET */);
    suggest.opts = self;
    showPopup(popup || getPopup(), suggest.$el, self.el);
}
function toggleSuggest(suggest, self, p) {
    var popup = p || getPopup(), show = true, array;
    if (hidePopup(popup)) {
        show = false;
    }
    else if ((array = self.cache).length) {
        if (!suggest.pstore.isSameArray(array))
            suggest.pstore.replace(array, 1 /* RESET */);
        suggest.opts = self;
        showPopup(popup, suggest.$el, self.el);
    }
    return show;
}
var emptyArray = [];
//var current: Opts, previous: Opts
function newWatchFn(pojo_, fk) {
    return function () {
        return pojo_[fk];
    };
}
function onUpdate(value, oldValue) {
    this.el.value = value;
    if (value)
        addClass(this.el.parentElement, 'suggested');
    else
        removeClass(this.el.parentElement, 'suggested');
}
function focusNT() {
    this.el.focus();
}
function onSelect(message, flags) {
    var self = this, name = message.name, value = message.id || message.value;
    if (!flags) {
        self.pending_name = name;
        self.pending_value = value;
        self.el.value = name;
    }
    else if (name === self.pojo_[self.fk]) {
        self.pending_name = null;
        self.el.value = name; // redudant
        addClass(this.el.parentElement, 'suggested');
        nextTick(self.focusNT);
    }
    else if (!this.cbfn || this.cbfn(name, value)) {
        self.pending_name = null;
        self.pojo_[self.fk] = name;
        self.pojo[self.field] = value;
        nextTick(self.focusNT);
    }
    else {
        self.pending_name = null;
        nextTick(self.focusNT);
    }
}
function postPS(req) {
    return rpc.post(this, ds.PS.$stringify(req));
}
export function parseOpts(args, pojo, field, fetch, cbfn, vm, el) {
    var i = 0, len = !args ? 0 : args.length, flags = i === len ? 0 : parseInt(args[i++], 10), pojo_ = pojo._, descriptor = pojo.$d, $ = descriptor.$, fk = $ ? $[field] : field;
    var opts = {
        flags: flags,
        pojo: pojo,
        field: field,
        fetch: typeof fetch === 'string' ? postPS.bind(fetch) : fetch,
        cbfn: cbfn,
        fk: fk,
        vm: vm,
        el: el,
        pojo_: pojo_,
        col_size: 0,
        table_flags: 0,
        update: 0 !== (flags & 16 /* UPDATE */),
        str: '',
        str_fetch: '',
        disabled: false,
        cache: emptyArray,
        pending_name: null,
        pending_value: null,
        unwatch: null,
        onSelect: null,
        cbFetchSuccess: null,
        cbFetchFailed: null,
        focusNT: null,
        //hideSuggestNT: null,
        //focusin: null,
        focusout: null,
        click: null,
        input: null,
        keydown: null
    };
    opts.unwatch = vm.$watch(newWatchFn(pojo_, fk), onUpdate.bind(opts));
    opts.onSelect = onSelect.bind(opts);
    opts.cbFetchSuccess = cbFetchSuccess.bind(opts);
    opts.cbFetchFailed = cbFetchFailed.bind(opts);
    opts.focusNT = focusNT.bind(opts);
    //opts.hideSuggestNT = hideSuggestNT.bind(opts)
    //el.addEventListener('focusin', opts.focusin = focusin.bind(opts))
    el.addEventListener('focusout', opts.focusout = focusout.bind(opts));
    el.addEventListener('click', opts.click = click.bind(opts));
    el.addEventListener('input', opts.input = debounce(input.bind(opts), 250));
    el.addEventListener('keydown', opts.keydown = keydown.bind(opts));
    return opts;
}
export function cleanup(opts) {
    var el = opts.el;
    //el.removeEventListener('focusin', opts.focusin)
    el.removeEventListener('focusout', opts.focusout);
    el.removeEventListener('click', opts.click);
    el.removeEventListener('input', opts.input);
    el.removeEventListener('keydown', opts.keydown);
    opts.unwatch();
}
/*function focusin(e) {
    e.preventDefault()
    e.stopPropagation()

    previous = current
    current = this

    //if (previous !== current)
    //    hidePopup(getInstance(), true)
}*/
/*function hideSuggestNT() {
    let suggest = getInstance()
    if (this === suggest.opts && hideSuggest(suggest, true)) {
        // hidden
    }
}*/
function focusout(e) {
    var self = this, name = self.pending_name, text = self.el.value;
    if (name) {
        if (!self.update && text !== name) {
            removeClass(self.el.parentElement, 'suggested');
        }
        else if (name === self.pojo_[self.fk]) {
            self.el.value = name; // redundant on non update
            addClass(self.el.parentElement, 'suggested');
        }
        else if (!self.cbfn || self.cbfn(name, self.pending_value)) {
            self.pojo_[self.fk] = name;
            self.pojo[self.field] = self.pending_value;
        }
        self.pending_name = null;
        hidePopup(getPopup());
    }
    else if (text === (name = self.pojo_[self.fk])) {
        if (text)
            addClass(self.el.parentElement, 'suggested'); // redundant
    }
    else if (self.update) {
        self.el.value = name;
        addClass(self.el.parentElement, 'suggested');
    }
    else if (text) {
        removeClass(self.el.parentElement, 'suggested');
    }
    else if (name) {
        self.el.value = name;
        addClass(self.el.parentElement, 'suggested');
    }
    //if (self === suggest.opts)
    //    window.setTimeout(self.hideSuggestNT, 100)
}
function click(e) {
    var self = this, suggest = getInstance(), text, popup;
    e.preventDefault();
    e.stopPropagation();
    if (self === suggest.opts && hidePopup(popup = getPopup()))
        return;
    text = self.el.value;
    if (text && text === self.str && self.cache.length) {
        showSuggest(suggest, self, popup);
    }
}
function cbFetchSuccess(data) {
    var self = this, value = self.str_fetch;
    self.disabled = false;
    if (value !== self.el.value) {
        nextTick(self.input);
        return true;
    }
    var array = data['1'], suggest = getInstance();
    suggest.opts = self;
    self.str = value;
    if (!array || !array.length) {
        self.cache = emptyArray;
        hidePopup(getPopup());
    }
    else {
        self.cache = array.reverse();
        showSuggest(suggest, self);
        nextTick(self.focusNT);
    }
    return true;
}
function cbFetchFailed(err) {
    this.disabled = false;
    if (this.str_fetch !== this.el.value)
        nextTick(this.input);
}
function input(e) {
    var self = this, el = self.el, value = el.value.trim();
    if (self.disabled) {
        // ignore
    }
    else if (value.length !== el.value.length) {
        // the new input has whitespace, replace with trimmed string
        el.value = value;
    }
    else if (!value) {
        hidePopup(getPopup());
    }
    else if (value === self.str) {
        // simply re-typed the single letter char
        showSuggest(getInstance(), self);
    }
    else {
        self.str_fetch = value;
        self.disabled = true;
        // TODO do not hardcode page size
        self.fetch(ds.PS.$create(value, ds.ParamRangeKey.$create(false, 11)))
            .then(self.cbFetchSuccess).then(undefined, self.cbFetchFailed);
    }
}
function keydown(e) {
    var self = this, suggest, pager;
    switch (e.which) {
        //case Keys.BACKSPACE:
        //    return self._input(e)
        case 13 /* ENTER */:
            // do not propagate the enter key event
            suggest = getInstance();
            if (self !== suggest.opts && self.cache.length) {
                // show your results.
                showSuggest(suggest, self);
            }
            else if (toggleSuggest(suggest, self) || self.el.value !== self.pending_name) {
                // noop
            }
            else if (!self.cbfn || self.cbfn(self.pending_name, self.pending_value)) {
                self.pojo_[self.fk] = self.pending_name;
                self.pojo[self.field] = self.pending_value;
                self.pending_name = null;
            }
            else {
                self.pending_name = null;
            }
            /*if (self.el.value) {
                togglePopup(getInstance(), self)
            } else if (!self.update && self.pojo[self.field]) {
                // reset suggest
            }*/
            break;
        case 27 /* ESCAPE */:
            /*if (!util.hidePopup(true) && self.from_editable) {
                getOwner(self).vmessage['f'+self.field_key] = false
            }*/
            //self.pending_name = null
            hidePopup(getPopup());
            break;
        case 37 /* LEFT */:
            if (!visiblePopup(getPopup()))
                return true;
            suggest = getInstance();
            pager = suggest.pager;
            if (e.ctrlKey)
                pageFirst(e, pager, self);
            else
                pagePrevOrLoad(e, pager, self.flags);
            break;
        case 38 /* UP */:
            if (!visiblePopup(getPopup()))
                break;
            suggest = getInstance();
            pager = suggest.pager;
            if (e.ctrlKey)
                moveTopOrUp(e, pager, self);
            else
                listUp(pager, pager.index_selected, e, self.flags); // TODO pass flags?
            break;
        case 39 /* RIGHT */:
            if (!visiblePopup(getPopup()))
                return true;
            suggest = getInstance();
            pager = suggest.pager;
            if (e.ctrlKey)
                pageLast(e, pager, self);
            else
                pageNextOrLoad(e, pager, self.flags);
            break;
        case 40 /* DOWN */:
            if (!visiblePopup(getPopup()))
                break;
            suggest = getInstance();
            pager = suggest.pager;
            if (e.ctrlKey)
                moveBottomOrDown(e, pager, self);
            else
                listDown(pager, pager.index_selected, e, self.flags); // TODO pass flags?
            break;
        default:
            //if (e.which >= 65 && e.which <= 90)
            //    return self._input(e)
            return true;
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
}
//# sourceMappingURL=_suggest.js.map