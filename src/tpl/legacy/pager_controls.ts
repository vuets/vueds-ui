declare function require(path: string): any;

import { when, anchor } from '../common'

import { PojoState } from 'vueds/lib/store'

export interface Opts {
    /**
     * Defaults to 'pager'
     */
    pager: string,
    attrs?: any,
    content_loc?: number
    track_clicks?: boolean
}

export function message_fragment(it: Opts): string {
    return `
<div v-show="${it.pager}.msg &amp;&amp; ${it.pager}.state &amp; ${PojoState.MASK_STATUS}">
  <div class="ui message"
      v-class="success:${it.pager}.state &amp; ${PojoState.SUCCESS},
               error:${it.pager}.state &amp; ${PojoState.ERROR},
               warning:${it.pager}.state &amp; ${PojoState.WARNING}">
    <i class="close icon" v-xon="click:${it.pager}.msg = null"></i>
    <span v-text="${it.pager}.msg"></span>
  </div>
</div>`
}

export function nav_item(it: Opts, content: string): string {
    let track_clicks = when(it.track_clicks, `, (${it.pager}.$clicks ^= 1)`)
    return `
<div class="item">
  <div class="ui tiny icon buttons">
    ${when(it.content_loc === 4, content)}
    <button type="button" class="ui button"
        v-disable="${it.pager}.state &amp; ${PojoState.LOADING} || ${it.pager}.page === 0"
        v-xon="click:${it.pager}.$handle(1, (${it.pager}.page = 0)${track_clicks})">
        <i class="double angle left icon"></i>
    </button>
    <button type="button" class="ui button" 
        v-disable="${it.pager}.state &amp; ${PojoState.LOADING} || ${it.pager}.page === 0"
        v-xon="click:${it.pager}.$handle(1, --${it.pager}.page${track_clicks})">
        <i class="angle left icon"></i>
    </button>
    <button type="button" class="ui button"
        v-disable="${it.pager}.state &amp; ${PojoState.LOADING} || ${it.pager}.page === ${it.pager}.page_count"
        v-xon="click:${it.pager}.$handle(1, ++${it.pager}.page${track_clicks})">
        <i class="angle right icon"></i>
    </button>
    <button type="button" class="ui button"
        v-disable="${it.pager}.state &amp; ${PojoState.LOADING} || ${it.pager}.page === ${it.pager}.page_count"
        v-xon="click:${it.pager}.$handle(1, (${it.pager}.page = ${it.pager}.page_count)${track_clicks})">
        <i class="double angle right icon"></i>
    </button>
    ${when(it.content_loc === 5, content)}
  </div>
</div>`
}

export function count_item(it: Opts, content: string): string {
    return `
<div class="item">
  ${when(it.content_loc === 7, content)}
  <span v-show="${it.pager}.size !== 0" v-text="${it.pager}.page_from"></span>
  <span v-show="${it.pager}.page_from !== ${it.pager}.page_to">
  <span v-show="${it.pager}.size !== 0" >-</span>
  <span v-text="${it.pager}.page_to"></span>
  </span> of <span v-text="${it.pager}.size"></span>
  ${when(it.content_loc === 8, content)}
</div>`
}

export function main(it: Opts, body: string): string {
    return ''
}