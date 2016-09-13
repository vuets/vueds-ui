import { component } from 'vuets'
import { defp, nullp, initObservable } from 'vueds'
import { PojoStore, Pager, StateObject, SelectionFlags, PojoListState } from 'vueds/lib/store/'
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
            createObservable(so: StateObject) {
                return ds.ACResult.$createObservable()
            },
            onSelect(message: ds.ACResult, flags: SelectionFlags): number {
                self.opts.onSelect(message, flags)
                return 0
            },
            fetch(req: ds.ParamRangeKey, pager: Pager) {
                let opts = self.opts,
                    store: PojoStore<ds.ACResult> = pager['store'],
                    startObj: ds.ACResult,
                    pgstart

                if (req.startKey) {
                    startObj = store.startObj
                    pgstart = startObj['name'] || startObj['1']
                }
                
                opts.fetch(ds.PS.$create(opts.str, req, undefined, pgstart))
                    .then(self.cbFetchSuccess).then(undefined, self.cbFetchFailed)
            }
        })).pager
    }
}
export default component({
    created(this: Suggest) { Suggest.created(this) },
    template: `
<div class="suggest" v-pager:${Flags.SUGGEST}="pager">
  <ul class="ui small divided selection list">
    <li v-for="pojo in pager.array" v-defp:pager_item="pojo" class="item"
        v-sclass:active="(pojo._.lstate & ${PojoListState.SELECTED})"
        v-show="(pojo._.lstate & ${PojoListState.INCLUDED})" v-text="pojo.name"></li>
  </ul>
  <div v-show="pager.size > pager.array.length">
    ${pager_controls.main({ pager: 'pager', without_rpc: true, without_msg: true }, ' ')}
  </div>
</div>`
}, Suggest)