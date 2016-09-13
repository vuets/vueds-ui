import { component } from 'vuets';
import { defp, nullp } from 'vueds';
import { PojoStore } from 'vueds/lib/store/';
import { ds } from 'vueds/lib/ds/';
import * as pager_controls from '../tpl/legacy/pager_controls';
var instance;
export function getInstance() {
    return instance;
}
export var Suggest = (function () {
    function Suggest() {
        nullp(this, 'pager');
        defp(this, 'opts', null);
    }
    Suggest.created = function (self) {
        instance = self;
        self.pager = defp(self, 'pstore', new PojoStore([], {
            desc: false,
            pageSize: 10,
            descriptor: ds.ACResult.$descriptor,
            keyProperty: '2',
            $keyProperty: 'value',
            createObservable: function (so) {
                return ds.ACResult.$createObservable();
            },
            onSelect: function (message, flags) {
                self.opts.onSelect(message, flags);
                return 0;
            },
            fetch: function (req, pager) {
                var opts = self.opts;
                opts.fetch(req, opts.str);
            }
        })).pager;
    };
    return Suggest;
}());
export default component({
    created: function () { Suggest.created(this); },
    //mounted(this: Suggest) { Suggest.mounted(this) },
    template: "\n<div class=\"suggest\" v-pager:" + 16 /* SUGGEST */ + "=\"pager\">\n  <ul class=\"ui small divided selection list\">\n    <li v-for=\"pojo in pager.array\" v-defp:pager_item=\"pojo\" class=\"item\"\n        v-sclass:active=\"(pojo._.lstate & " + 2 /* SELECTED */ + ")\"\n        v-show=\"(pojo._.lstate & " + 1 /* INCLUDED */ + ")\" v-text=\"pojo.name\"></li>\n  </ul>\n  <div v-show=\"pager.size > pager.array.length\">\n    " + pager_controls.main({ pager: 'pager', without_rpc: true, without_msg: true }, ' ') + "\n  </div>\n</div>"
}, Suggest);
//# sourceMappingURL=suggest.js.map