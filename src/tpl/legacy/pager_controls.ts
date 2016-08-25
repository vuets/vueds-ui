declare function require(path: string): any;

import { include_if, when, anchor } from '../common'

import { PagerState } from 'vueds/lib/store'

export interface Opts {
    /**
     * Defaults to 'pager'
     */
    pager: string
    flags?: number
    top?: boolean
    content_loc?: number

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
<div v-show="${pager}.msg &amp;&amp; ${pager}.state &amp; ${PagerState.MASK_STATUS}">
  <div class="ui message"
      v-pclass:status-="${pager}.state &amp; ${PagerState.MASK_STATUS}">
    <i class="close icon" @click.prevent="${pager}.msg = null"></i>
    <span v-text="${pager}.msg"></span>
  </div>
</div>`
}

export function sort_btn(it: Opts): string {
    return `
<button type="button" class="ui button"
    v-disable="2 > ${it.pager}.size || ${it.pager}.state &amp; ${PagerState.LOADING}"
    v-xon="click:${it.pager}.$handle(1, 
        (${it.pager}.state ^= ${PagerState.DESC}${include_if(it.track_clicks, track_clicks, it)}))">
  <i class="icon"
      v-class="${it.reverse_icon ? 'down': 'up'}:(${it.pager}.state &amp; ${PagerState.DESC}) === 0, 
      ${it.reverse_icon ? 'up': 'down'}:${it.pager}.state &amp; ${PagerState.DESC}"></i>
</button>`
}

export function rpc_newer_btn(it: Opts): string {
    return `
<button type="button" class="ui button" 
    v-disable="${it.pager}.state &amp; ${PagerState.MASK_RPC_DISABLE}"
    v-xon="click:${it.pager}.$handle(16, ${it.flags || 0}${include_if(it.track_clicks, track_clicks, it)})">
  <i class="reply mail icon"></i>
</button>`
}

export function rpc_older_btn(it: Opts): string {
    return `
<button type="button" class="ui button"
    v-disable="${it.pager}.state &amp; ${PagerState.MASK_RPC_DISABLE} || ${it.pager}.size === 0"
    v-xon="click:${it.pager}.$handle(17, ${it.flags || 0}${include_if(it.track_clicks, track_clicks, it)})">
  <i class="forward mail icon"></i>
</button>`
}

export function rpc_reload_btn(it: Opts): string {
    return `
<button type="button" class="ui button"
    v-disable="${it.pager}.state &amp; ${PagerState.MASK_RPC_DISABLE} || ${it.pager}.size === 0"
    v-xon="click:${it.pager}.$handle(4${include_if(it.track_clicks, track_clicks, it)})">
  <i class="repeat icon"></i>
</button>`
}

export function rpc_item(it: Opts): string {
    return `
<div>
  <div class="ui tiny icon buttons">
    ${when(it.content_loc === 1, it._content)}
    ${include_if(!it.without_sort, sort_btn, it)}
    ${include_if(!it.without_rpc_newer, rpc_newer_btn, it)}
    ${include_if(!it.without_rpc_older, rpc_older_btn, it)}
    ${include_if(!it.without_rpc_reload, rpc_reload_btn, it)}
    ${when(it.content_loc === 2, it._content)}
  </div>
</div>`
}

export function nav_item(it: Opts): string {
    return `
<div class="item">
  <div class="ui tiny icon buttons">
    ${when(it.content_loc === 4, it._content)}
    <button type="button" class="ui button"
        v-disable="${it.pager}.state &amp; ${PagerState.LOADING} || ${it.pager}.page === 0"
        v-xon="click:${it.pager}.$handle(1, (${it.pager}.page = 0)${include_if(it.track_clicks, track_clicks, it)})">
        <i class="double angle left icon"></i>
    </button>
    <button type="button" class="ui button" 
        v-disable="${it.pager}.state &amp; ${PagerState.LOADING} || ${it.pager}.page === 0"
        v-xon="click:${it.pager}.$handle(1, --${it.pager}.page${include_if(it.track_clicks, track_clicks, it)})">
        <i class="angle left icon"></i>
    </button>
    <button type="button" class="ui button"
        v-disable="${it.pager}.state &amp; ${PagerState.LOADING} || ${it.pager}.page === ${it.pager}.page_count"
        v-xon="click:${it.pager}.$handle(1, ++${it.pager}.page${include_if(it.track_clicks, track_clicks, it)})">
        <i class="angle right icon"></i>
    </button>
    <button type="button" class="ui button"
        v-disable="${it.pager}.state &amp; ${PagerState.LOADING} || ${it.pager}.page === ${it.pager}.page_count"
        v-xon="click:${it.pager}.$handle(1, 
            (${it.pager}.page = ${it.pager}.page_count)${include_if(it.track_clicks, track_clicks, it)})">
        <i class="double angle right icon"></i>
    </button>
    ${when(it.content_loc === 5, it._content)}
  </div>
</div>`
}

export function count_item(it: Opts): string {
    return `
<div class="item">
  ${when(it.content_loc === 7, it._content)}
  <span v-show="${it.pager}.size !== 0" v-text="${it.pager}.page_from"></span>
  <span v-show="${it.pager}.page_from !== ${it.pager}.page_to">
  <span v-show="${it.pager}.size !== 0" >-</span>
  <span v-text="${it.pager}.page_to"></span>
  </span> of <span v-text="${it.pager}.size"></span>
  ${when(it.content_loc === 8, it._content)}
</div>`
}

function list_class(it: Opts): string {
    return ` ${it.list_class}`
}

function attrs(it: Opts): string {
    var buf = ' '
    for (var i in attrs) {
        buf += i + '="' + attrs[i] + '"'
    }
    return buf
}

export function main(it: Opts, body?: string): string {
    it._content = body || anchor
    return `
${include_if(!it.without_msg && it.top, msg_fragment, it)}
<div class="ui tiny horizontal list${include_if(it.list_class, list_class, it)}"${include_if(it.attrs, attrs, it)}>
  ${when(it.content_loc === 0, it._content)}
  ${include_if(!it.without_rpc, rpc_item, it)}
  ${when(it.content_loc === 3, it._content)}
  ${include_if(!it.without_nav, nav_item, it)}
  ${when(it.content_loc === 6, it._content)}
  ${include_if(!it.without_count, count_item, it)}
  ${when(it.content_loc === 9, it._content)}
</div>
${include_if(!it.without_msg && !it.top, msg_fragment, it)}
`
}