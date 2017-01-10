import { component } from 'vuets'
import { defp, nullp } from 'vueds'
import { PojoStore, Pager, ItemSO, SelectionFlags, PojoListState } from 'vueds/lib/store/'
import { ds } from 'vueds/lib/ds/'
import * as pager_controls from '../tpl/legacy/pager_controls'
import { Flags } from '../_pager'

var instance: Suggest

export interface Opts {
    str: string
    fetch(req: ds.PS)
    onSelect(message: ds.ACResult, flags: SelectionFlags)
}

export function getInstance(): Suggest {
    return instance
}

function cbFetchSuccess(this: Suggest, data) {
    this.pstore.cbFetchSuccess(data['1'])
    return true
}

function cbFetchFailed(this: Suggest, err) {
    this.pstore.cbFetchFailed(err)
}

export class Suggest {
    pager: Pager
    pstore: PojoStore<ds.ACResult>
    opts: Opts

    cbFetchSuccess: any
    cbFetchFailed: any
    
    constructor() {
        nullp(this, 'pager')
        defp(this, 'opts', null)
    }
    
    static created(self: Suggest) {
        instance = self

        self.cbFetchSuccess = cbFetchSuccess.bind(self)
        self.cbFetchFailed = cbFetchFailed.bind(self)

        self.pager = defp(self, 'pstore', new PojoStore([], {
            desc: false,
            pageSize: 10,
            descriptor: ds.ACResult.$descriptor,
            keyProperty: '2',
            $keyProperty: 'value',
            createObservable(so: ItemSO, idx: number) {
                return ds.ACResult.$createObservable()
            },
            onSelect(selected: ds.ACResult, flags: SelectionFlags): number {
                self.opts.onSelect(selected, flags)
                return 0
            },
            fetch(req: ds.ParamRangeKey, pager: Pager) {
                let opts = self.opts,
                    val = opts.str.toLowerCase(),
                    store: PojoStore<ds.ACResult> = pager['store'],
                    startObj,
                    pgstart

                if (req.startKey && (startObj = store.startObj)) {
                    pgstart = startObj.$d ? startObj.name : startObj['1']
                    pgstart = pgstart.toLowerCase()
                }
                
                opts.fetch(ds.PS.$create(val, req, undefined, pgstart))
                    .then(self.cbFetchSuccess).then(undefined, self.cbFetchFailed)
            }
        })).pager
    }
}
const item_tpl = `
<li v-defp:pager_item="pojo" class="item"
    v-sclass:active="(pojo._.lstate & ${PojoListState.SELECTED})"
    v-show="(pojo._.lstate & ${PojoListState.INCLUDED})" v-text="pojo.name"></li>
`
export default component({
    created(this: Suggest) { Suggest.created(this) },
    components: {
        si: {
            name: 'si',
            props: {
                pojo: { type: Object, required: true }
            },
            template: item_tpl
        }
    },
    template: `
<div class="suggest" v-pager:${Flags.SUGGEST}="pager">
  <ul class="ui small divided selection list">
    <si v-for="pojo in pager.array" :pojo="pojo"></si>
  </ul>
  <div v-show="pager.size > pager.array.length">
    ${pager_controls.main({ pager: 'pager', without_rpc: true, without_msg: true }, ' ')}
  </div>
</div>`
}, Suggest)