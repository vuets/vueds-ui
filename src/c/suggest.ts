import { component } from 'vuets'
import { defp, nullp, initObservable } from 'vueds'
import { PojoStore, Pager, StateObject, SelectionFlags, PojoListState } from 'vueds/lib/store/'
import { ds } from 'vueds/lib/ds/'
import * as pager_controls from '../tpl/legacy/pager_controls'
import { Flags } from '../_pager'

var instance: Suggest

export interface Opts {
    str: string
    fetch(req: ds.ParamRangeKey, str: string)
    onSelect(message: ds.ACResult, flags: SelectionFlags)
}

export function getInstance(): Suggest {
    return instance
}

export class Suggest {
    pager: Pager
    pstore: PojoStore<ds.ACResult>
    opts: Opts
    
    constructor() {
        nullp(this, 'pager')
        defp(this, 'opts', null)
    }
    
    static created(self: Suggest) {
        instance = self
        self.pager = defp(self, 'pstore', new PojoStore([], {
            desc: true,
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
                let opts = self.opts
                opts.fetch(req, opts.str)
            }
        })).pager
    }
    /*static mounted(self: Suggest) {
        //self.add('foo', 'bar', 1)
        //self.add('baz', 'zoo', 1)
    }

    add(name: string, value: string, id?: number) {
        let str = ds.ACResult.$stringify(ds.ACResult.$create(name, value, id))
        this.pstore.add(JSON.parse(str) as ds.ACResult, true, true)
    }*/
}
export default component({
    created(this: Suggest) { Suggest.created(this) },
    //mounted(this: Suggest) { Suggest.mounted(this) },
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