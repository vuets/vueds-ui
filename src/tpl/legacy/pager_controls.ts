declare function require(path: string): any;

import { include_if, when, anchor, tern_yes_no, attrs } from '../common'

import { PagerState } from 'vueds/lib/store'

export const enum ContentSlot {
    FIRST = 0,

    RPC_FIRST = 1,
    RPC_LAST = 2,

    BEFORE_NAV = 3,

    NAV_FIRST = 4,
    NAV_LAST = 5,

    BEFORE_COUNT = 6,

    COUNT_FIRST = 7,
    COUNT_LAST = 8,

    LAST = 9
}

export interface Opts {
    /**
     * Defaults to 'pager'
     */
    pager: string
    flags?: number
    top?: boolean
    content_slot?: ContentSlot

    attrs?: any
    track_clicks?: boolean

    without_sort?: boolean
    reverse_icon?: boolean

    without_nav?: boolean

    without_count?: boolean

    without_rpc?: boolean
    without_rpc_newer?: boolean
    without_rpc_older?: boolean
    without_rpc_reload?: boolean

    without_msg?: boolean

    list_class?: string

    _content?: string
}

function track_clicks(it: Opts): string {
    return `, (${it.pager}.$clicks ^= 1)`
}

export function msg_fragment(it: Opts): string {
    let pager = it.pager
    return `
<div v-show="${pager}.msg && (${pager}.state & ${PagerState.MASK_STATUS})">
  <div class="ui message" v-pclass:status-="(${pager}.state & ${PagerState.MASK_STATUS})">
    <i class="close icon" @click.prevent="${pager}.msg = null"></i>
    <span v-text="${pager}.msg"></span>
  </div>
</div>`
}

export function sort_btn(it: Opts): string {
    let pager = it.pager
    return `
<button type="button" class="ui button"
    v-disable="2 > ${pager}.size || (${pager}.state & ${PagerState.LOADING})"
    @click.prevent="pager.store.repaint(
        (${pager}.state ^= ${PagerState.DESC})${include_if(it.track_clicks, track_clicks, it)})">
  <i class="icon" v-pclass:desc-="${pager}.state & ${PagerState.DESC} ? ${tern_yes_no(!it.reverse_icon)}"></i>
</button>`
}

export function rpc_newer_btn(it: Opts): string {
    return `
<button type="button" class="ui button" 
    v-disable="(${it.pager}.state & ${PagerState.MASK_RPC_DISABLE})"
    @click.prevent="${it.pager}.store.pagePrevOrLoad(${it.flags || 0}${include_if(it.track_clicks, track_clicks, it)})">
  <i class="icon reply"></i>
</button>`
}

export function rpc_older_btn(it: Opts): string {
    return `
<button type="button" class="ui button"
    v-disable="(${it.pager}.state & ${PagerState.MASK_RPC_DISABLE}) || ${it.pager}.size === 0"
    @click.prevent="${it.pager}.store.pageNextOrLoad(${it.flags || 0}${include_if(it.track_clicks, track_clicks, it)})">
  <i class="icon forward"></i>
</button>`
}

export function rpc_reload_btn(it: Opts): string {
    return `
<button type="button" class="ui button"
    v-disable="(${it.pager}.state & ${PagerState.MASK_RPC_DISABLE}) || ${it.pager}.size === 0"
    @click.prevent="${it.pager}.store.reload(${include_if(it.track_clicks, track_clicks, it)})">
  <i class="icon cw"></i>
</button>`
}

export function rpc_item(it: Opts): string {
    return `
<div class="item">
  <div class="ui tiny icon buttons">
    ${when(it.content_slot === ContentSlot.RPC_FIRST, it._content)}
    ${include_if(!it.without_sort, sort_btn, it)}
    ${include_if(!it.without_rpc_newer, rpc_newer_btn, it)}
    ${include_if(!it.without_rpc_older, rpc_older_btn, it)}
    ${include_if(!it.without_rpc_reload, rpc_reload_btn, it)}
    ${when(it.content_slot === ContentSlot.RPC_LAST, it._content)}
  </div>
</div>`
}

export function nav_item(it: Opts): string {
    let pager = it.pager, 
        track_clicks_ = include_if(it.track_clicks, track_clicks, it)
    return `
<div class="item">
  <div class="ui tiny slim icon buttons">
    ${when(it.content_slot === ContentSlot.NAV_FIRST, it._content)}
    <button type="button" class="ui button"
        v-disable="(${pager}.state & ${PagerState.LOADING}) || ${pager}.page === 0"
        @click.prevent="${pager}.store.repaint((${pager}.page = 0)${track_clicks_})">
      <i class="icon angle-double-left"></i>
    </button>
    <button type="button" class="ui button" 
        v-disable="(${pager}.state & ${PagerState.LOADING}) || ${pager}.page === 0"
        @click.prevent="${pager}.store.repaint(--${pager}.page${track_clicks_})">
      <i class="icon angle-left"></i>
    </button>
    <button type="button" class="ui button"
        v-disable="(${pager}.state & ${PagerState.LOADING}) || ${pager}.page === ${pager}.page_count"
        @click.prevent="${pager}.store.repaint(++${pager}.page${track_clicks_})">
        <i class="icon angle-right"></i>
    </button>
    <button type="button" class="ui button"
        v-disable="(${pager}.state & ${PagerState.LOADING}) || ${pager}.page === ${pager}.page_count"
        @click.prevent="${pager}.store.repaint((${pager}.page = ${pager}.page_count)${track_clicks_})">
      <i class="icon angle-double-right"></i>
    </button>
    ${when(it.content_slot === ContentSlot.NAV_LAST, it._content)}
  </div>
</div>`
}

export function count_item(it: Opts): string {
    let pager = it.pager
    return `
<div class="item">
  ${when(it.content_slot === ContentSlot.COUNT_FIRST, it._content)}
  <span v-show="${pager}.size !== 0" v-text="${pager}.page_from"></span>
  <span v-show="${pager}.page_from !== ${pager}.page_to">
  <span v-show="${pager}.size !== 0" >-</span>
  <span v-text="${pager}.page_to"></span>
  </span> of <span v-text="${pager}.size"></span>
  ${when(it.content_slot === ContentSlot.COUNT_LAST, it._content)}
</div>`
}

function list_class(it: Opts): string {
    return ` ${it.list_class}`
}

export function main(it: Opts, content?: string): string {
    it._content = typeof content === 'string' ? content : anchor
    return `
${include_if(!it.without_msg && it.top, msg_fragment, it)}
<div class="ui skimped tiny horizontal list${include_if(it.list_class, list_class, it)}"${attrs(it.attrs)}>
  ${when(it.content_slot === ContentSlot.FIRST, it._content)}
  ${include_if(!it.without_rpc, rpc_item, it)}
  ${when(it.content_slot === ContentSlot.BEFORE_NAV, it._content)}
  ${include_if(!it.without_nav, nav_item, it)}
  ${when(it.content_slot === ContentSlot.BEFORE_COUNT, it._content)}
  ${include_if(!it.without_count, count_item, it)}
  ${when(it.content_slot === ContentSlot.LAST, it._content)}
</div>
${include_if(!it.without_msg && !it.top, msg_fragment, it)}
`
}