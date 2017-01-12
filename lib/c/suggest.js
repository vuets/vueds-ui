import { component } from 'vuets';
import { defp, nullp } from 'vueds/lib/util';
import { PojoStore } from 'vueds/lib/store/';
import { ds } from 'vueds/lib/ds/';
import * as pager_controls from '../tpl/legacy/pager_controls';
var instance;
export function getInstance() {
    return instance;
}
function cbFetchSuccess(data) {
    this.pstore.cbFetchSuccess(data['1']);
    return true;
}
function cbFetchFailed(err) {
    this.pstore.cbFetchFailed(err);
}
var Suggest = (function () {
    function Suggest() {
        nullp(this, 'pager');
        defp(this, 'opts', null);
    }
    Suggest.created = function (self) {
        instance = self;
        self.cbFetchSuccess = cbFetchSuccess.bind(self);
        self.cbFetchFailed = cbFetchFailed.bind(self);
        self.pager = defp(self, 'pstore', new PojoStore([], {
            desc: false,
            pageSize: 10,
            descriptor: ds.ACResult.$descriptor,
            keyProperty: '2',
            $keyProperty: 'value',
            createObservable: function (so, idx) {
                return ds.ACResult.$createObservable();
            },
            onSelect: function (selected, flags) {
                self.opts.onSelect(selected, flags);
                return 0;
            },
            fetch: function (req, pager) {
                var opts = self.opts, val = opts.str.toLowerCase(), store = pager['store'], startObj, pgstart;
                if (req.startKey && (startObj = store.startObj)) {
                    pgstart = startObj.$d ? startObj.name : startObj['1'];
                    pgstart = pgstart.toLowerCase();
                }
                opts.fetch(ds.PS.$create(val, req, undefined, pgstart))
                    .then(self.cbFetchSuccess).then(undefined, self.cbFetchFailed);
            }
        })).pager;
    };
    return Suggest;
}());
export { Suggest };
var item_tpl = "\n<li v-defp:pager_item=\"pojo\" class=\"item\"\n    v-sclass:active=\"(pojo._.lstate & " + 2 /* SELECTED */ + ")\"\n    v-show=\"(pojo._.lstate & " + 1 /* INCLUDED */ + ")\" v-text=\"pojo.name\"></li>\n";
export default component({
    created: function () { Suggest.created(this); },
    components: {
        si: {
            name: 'si',
            props: {
                pojo: { type: Object, required: true }
            },
            template: item_tpl
        }
    },
    template: "\n<div class=\"suggest\" v-pager:" + 512 /* SUGGEST */ + "=\"pager\">\n  <ul class=\"ui small divided selection list\">\n    <si v-for=\"pojo in pager.array\" :pojo=\"pojo\"></si>\n  </ul>\n  <div v-show=\"pager.size > pager.array.length\">\n    " + pager_controls.main({ pager: 'pager', without_rpc: true, without_msg: true }, ' ') + "\n  </div>\n</div>"
}, Suggest);
//# sourceMappingURL=suggest.js.map