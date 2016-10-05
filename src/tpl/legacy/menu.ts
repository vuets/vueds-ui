import { PagerState } from 'vueds/lib/store/'
import { when, attr } from '../common'

export const enum ContentLoc {
    RIGHT_MENU = 1
}

export interface CommonOpts {
    itoggle_id?: string
    content_loc?: ContentLoc
    id?: string
}

function itoggle_id(it: CommonOpts): string {
    return `
<div class="item">
  <a v-itoggle="click,1,resize-small,resize-full:[ ['${it.itoggle_id}'] ]">
    <i class="icon resize-full"></i>
  </a>
</div>`
}

function dropdown(it: CommonOpts, content: string): string {
    return `
<div class="item">
  <div class="dropdown"${attr(it, "id")}>
    <div v-toggle="'1'"><i class="icon down-dir"></i></div>
    <ul class="dropdown-menu" v-close="'1'">
      ${content}
    </ul>
  </div>
</div>`
}

export function right_menu(it: CommonOpts, content?: string): string {
    return `
<div class="right menu">
  ${it.itoggle_id && itoggle_id(it) || ''}
  ${it.content_loc === ContentLoc.RIGHT_MENU && content || ''}
  ${!it.content_loc && content && dropdown(it, content) || ''}
</div>`
}

export interface SimpleOpts extends CommonOpts {
    title: string
}

export function simple(it: SimpleOpts, content?: string): string {
    return `
<div class="ui attached large secondary pointing menu">
  <div class="item">
    <div class="ui small further left icon input">
      <input type="text" placeholder="${it.title}" disabled />
    </div>
  </div>
  ${right_menu(it, content)}
</div>`
}

export interface PagerOpts extends CommonOpts {
    pager: string
    title: string
    search_fk: string
    dpager?: string // pager used for disable state
}

function disable(it: PagerOpts, dpager): string {
    return ` v-disable="(${dpager}.state & ${PagerState.LOADING}) || (!${dpager}.size && !(${dpager}.state & ${PagerState.LOCAL_SEARCH}))"`
}

export function pager(it: PagerOpts, content?: string): string {
    let dpager = it.dpager || it.pager
    return `
<div class="ui attached large secondary pointing menu">
  <div class="item">
    <div class="ui small further left icon input">
      <input type="text" placeholder="${it.title}"${disable(it, it.dpager || it.pager)}
          v-lsearch="{ pager: ${it.pager}, fields: ['${it.search_fk}'] }" />
      <i class="icon search"></i>
    </div>
  </div>
  ${right_menu(it, content)}
</div>`
}