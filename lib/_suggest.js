import { ds } from 'vueds/lib/ds/';
import { getInstance } from './c/suggest';
import { removeClass, addClass, hasClass, popTo } from './dom_util';
function hidePopup(suggest, conditional) {
    var popup = suggest.$el.parentElement;
    if (conditional && hasClass(popup, 'active'))
        return false;
    popup.style.visibility = 'hidden';
    removeClass(popup, 'active');
    return true;
}
function showPopup(suggest, self) {
    var popup = suggest.$el.parentElement;
    addClass(popup, 'active');
    popTo(self.el, popup);
}
function togglePopup(suggest, self) {
    var popup = suggest.$el.parentElement, show = true;
    if (hasClass(popup, 'active')) {
        popup.style.visibility = 'hidden';
        removeClass(popup, 'active');
        show = false;
    }
    else {
        addClass(popup, 'active');
        popTo(self.el, popup);
    }
    return show;
}
function isPopupShown(suggest) {
    var popup = suggest.$el.parentElement;
    return hasClass(popup, 'active');
}
var emptyArray = [];
var current, previous;
function newWatchFn(pojo, fk) {
    return function () {
        return pojo._[fk];
    };
}
function onUpdate(value, oldValue) {
    this.el.value = value;
}
function onSelect(message, flags) {
    var self = this;
    //self.el.value = message.name
    self.pojo._[self.fk] = message.name;
    self.pojo[self.field] = message.id || message.value;
}
export function parseOpts(args, pojo, field, fetch, vm, el) {
    var i = 0, len = !args ? 0 : args.length, flags = i === len ? 0 : parseInt(args[i++], 10), descriptor = pojo.$d, $ = descriptor.$, fk = $ ? $[field] : field;
    var opts = {
        flags: flags,
        pojo: pojo,
        field: field,
        fetch: fetch,
        fk: fk,
        vm: vm,
        el: el,
        str: '',
        empty: true,
        disabled: false,
        cache: emptyArray,
        unwatch: null,
        onSelect: null,
        focusin: null,
        focusout: null,
        click: null,
        input: null
    };
    opts.unwatch = vm.$watch(newWatchFn(pojo, fk), onUpdate.bind(opts));
    opts.onSelect = onSelect.bind(opts);
    el.addEventListener('focusin', opts.focusin = focusin.bind(opts));
    //el.addEventListener('focusout', opts.focusout = focusout.bind(opts))
    ////el.addEventListener('focusout', opts.focusout = debounce(focusout.bind(opts), 200))
    //el.addEventListener('click', opts.click = click.bind(opts))
    el.addEventListener('input', opts.input = input.bind(opts));
    return opts;
}
export function cleanup(opts) {
    var el = opts.el;
    el.removeEventListener('focusin', opts.focusin);
    //el.removeEventListener('focusout', opts.focusout)
    //el.removeEventListener('click', opts.click)
    el.removeEventListener('input', opts.input);
    opts.unwatch();
}
function focusin(e) {
    e.preventDefault();
    e.stopPropagation();
    previous = current;
    current = this;
    //if (previous !== current)
    //    hidePopup(getInstance(), true)
}
function focusout(e) {
    var self = this, suggest = getInstance(), pager = suggest.pager;
    if (isPopupShown(suggest)) {
    }
    else if (pager.index_selected === -1) {
        self.el.value = '';
    }
    else if (pager.pojo.name !== self.el.value) {
    }
    else {
    }
}
/*function verifySelectionClick(self: Opts, suggest, obj, selected, clicks) {
    if (clicks !== suggest.pager.$clicks) return
    
    if (self === current && suggest.$el.parentElement) {
        // hide if still visible
        util.hidePopup(true)
    }
    
    if (self.str_selected !== self.el.value) resetSuggest(self, obj, selected)
    else if (selected) selectSuggest(selected, self, obj)
    //else console.log('noop')
}*

function focusout(e) {
    let self: Opts = this,
        suggest = getInstance(),
        obj = getOwner(self),
        selected = self.selected
    
    if (isPopupShown(suggest)) verifySelectionClick(self, suggest, obj, selected, pager.$clicks)
    else if (self.str_selected !== self.el.value) resetSuggest(self, obj, selected)
    else if (selected) selectSuggest(selected, self, obj)
}*/
function click(e) {
    e.preventDefault();
    e.stopPropagation();
    var suggest = getInstance(), self, text;
    if (isPopupShown(suggest))
        return;
    self = this;
    text = self.el.value;
    if (text && text === self.str && self.cache.length) {
        showPopup(suggest, self);
    }
}
function input(e) {
    var self = this, el = self.el, value = el.value.trim();
    if (self.disabled) {
    }
    else if (value.length !== el.value.length) {
        // the new input has whitespace, replace with trimmed string
        el.value = value;
    }
    else if (!value) {
        self.empty = true;
        hidePopup(getInstance());
    }
    else if (value === self.str) {
        // simply re-typed the single letter char
        getInstance().pstore.replace(self.cache);
        showPopup(getInstance(), self);
    }
    else {
        el.disabled = self.disabled = true;
        self.fetch(ds.ParamRangeKey.$create(false, 11), value)
            .then(function (data) {
            var array = data['1'], empty = !array || !array.length, suggest = getInstance();
            suggest.opts = self;
            self.str = value;
            if (empty) {
                self.cache = emptyArray;
            }
            else {
                self.cache = array;
                suggest.pstore.replace(array, 1 /* RESET */);
                showPopup(suggest, self);
            }
            el.disabled = self.disabled = false;
            return empty;
        })
            .then(undefined, function (err) {
            // ignore
            el.disabled = self.disabled = false;
        });
    }
}
//# sourceMappingURL=_suggest.js.map