"use strict";
var Vue = require('vue');
var FragmentFactory = Vue['FragmentFactory'];
var before = Vue.util.before;
var replace = Vue.util.replace;
var remove = Vue.util.remove;
var createAnchor = Vue.util.createAnchor;
exports.templates = {};
Vue.directive('xp', {
    terminal: true,
    bind: function () {
    },
    unbind: function () {
        var str_frag = this.str_frag, el_frag = this.el_frag;
        if (!str_frag)
            return;
        str_frag.remove();
        if (el_frag)
            el_frag.remove();
    },
    update: function (value, oldValue) {
        var el = this.el, arg = this.arg, host = this._host, scope = this._scope, frag = this._frag, vm = this.vm, tpl = exports.templates[arg], anchor;
        if (!tpl) {
            console.warn("The xp template " + arg + " could not be resolved.");
            return;
        }
        this.str_frag = new FragmentFactory(vm, tpl.main(value)).create(host, scope, frag);
        if (!el.firstChild) {
            if (value.$replace) {
                this.str_frag.before(el, false);
                remove(el);
            }
            else {
                el.appendChild(anchor = createAnchor('v-xp', false));
                this.str_frag.before(anchor, false);
            }
            return;
        }
        this.el_frag = new FragmentFactory(vm, el.innerHTML).create(host, scope, frag);
        el.innerHTML = ' ';
        this.str_frag.before(el.firstChild, false);
        anchor = el.querySelector('content');
        if (value.$replace) {
            while (el.firstChild)
                before(el.firstChild, el);
            this.el_frag.before(anchor || el);
            remove(el);
            if (anchor)
                remove(anchor);
        }
        else if (anchor) {
            this.el_frag.before(anchor);
            remove(anchor);
        }
        else {
            el.appendChild(anchor = createAnchor('v-xp', false));
            this.el_frag.before(anchor);
        }
    }
});
//# sourceMappingURL=index.js.map