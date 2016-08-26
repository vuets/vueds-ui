
export interface PropOptions {
    type: Function | Array<Function> | null
    default: any
    required: boolean | null
    validator: Function | null
}

export interface ComponentOptions {
    // data
    data: Object | Function | void
    props?: { [key: string]: PropOptions }
    propsData?: Object | null
    computed?: {
        [key: string]: Function | {
            get?: Function
            set?: Function
            cache?: boolean
        }
    }
    methods?: {
        [key: string]: Function
    }
    watch?: {
        [key: string]: Function | string
    }
    // DOM
    el?: string | Element
    template?: string
    render: () => VNode
    staticRenderFns?: Array<() => VNode>
    // lifecycle
    init?: Function
    created?: Function
    beforeMount?: Function
    mounted?: Function
    beforeUpdate?: Function
    updated?: Function
    // assets
    directives?: { [key: string]: Object }
    //components?: { [key: string]: Class<Component> }
    transitions?: { [key: string]: Object }
    filters?: { [key: string]: Function }
    // misc
    parent?: Component
    mixins?: Array<Object>
    name?: string
    //extends?: Class<Component> | Object
    delimiters?: [string, string]

    // private
    _isComponent?: boolean
    _propKeys?: Array<string>
    _parentVnode?: VNode
    _parentListeners?: Object | null
    _renderChildren?: VNodeChildren | null
}

export declare class Dep {
    static target: Watcher | null
    id: number
    subs: Array<Watcher>
}

export declare class Set {
    set: Object

    has(key: string | number): boolean
    add(key: string | number)
    clear()
}

export declare class Watcher {
    vm: Component
    expression: string
    cb: Function
    id: number
    deep: boolean
    user: boolean
    lazy: boolean
    sync: boolean
    dirty: boolean
    active: boolean
    deps: Array<Dep>
    newDeps: Array<Dep>
    depIds: Set
    newDepIds: Set
    getter: Function
    value: any

    constructor(
        vm: Component,
        expOrFn: string | Function,
        cb: Function,
        options: Object
        //options?: Object = {}
    )
}

export declare class Component {
    // constructor information
    static cid: number
    static options: Object
    // extend
    static extend: (options: Object) => Function
    static superOptions: Object
    static extendOptions: Object
    //static super: Class<Component>
    // assets
    static directive: (id: string, def?: Function | Object) => Function | Object | void
    //static component: (id: string, def?: Class<Component> | Object) => Class<Component>
    static filter: (id: string, def?: Function) => Function | void

    // public properties
    $el: any // so that we can attach __vue__ to it
    $data: Object
    $options: ComponentOptions
    $parent: Component | void
    $root: Component
    $children: Array<Component>
    $refs: { [key: string]: Component | Element | Array<Component | Element> | void }
    $slots: { [key: string]: Array<VNode> }
    $vnode: VNode
    $isServer: boolean

    // public methods
    $mount: (el?: Element | string, hydrating?: boolean) => Component
    $forceUpdate: () => void
    $destroy: () => void
    $set: (obj: Array<any> | Object, key: any, val: any) => void
    $delete: (obj: Object, key: string) => void
    $watch: (expOrFn: string | Function, cb: Function, options?: Object) => Function
    $on: (event: string, fn: Function) => Component
    $once: (event: string, fn: Function) => Component
    $off: (event?: string, fn?: Function) => Component
    $emit: (event: string, ...args: Array<any>) => Component
    $nextTick: (fn: Function) => void
    $createElement: (
        tag?: string | Component,
        data?: Object,
        children?: VNodeChildren,
        namespace?: string
    ) => VNode

    // private properties
    _uid: number
    _isVue: boolean
    _self: Component
    _renderProxy: Component
    _renderParent: Component | null
    _watcher: Watcher
    _watchers: Array<Watcher>
    _data: Object
    _events: Object
    _inactive: boolean
    _isMounted: boolean
    _isDestroyed: boolean
    _isBeingDestroyed: boolean
    _vnode: VNode | null
    _staticTrees: Array<VNode> | null
}

export declare class VNode {
    tag: string | void
    data: VNodeData | void
    children: Array<VNode> | void
    text: string | void
    elm: Node | void
    ns: string | void
    context: Component | void // rendered in this component's scope
    key: string | number | void
    componentOptions: VNodeComponentOptions | void
    child: Component | void // component instance
    parent: VNode | void // compoennt placeholder node
    raw: boolean | null // contains raw HTML
    isStatic: boolean | null // hoisted static node
    isRootInsert: boolean // necessary for enter transition check
    isComment: boolean

    constructor(
        tag?: string,
        data?: VNodeData,
        children?: Array<VNode> | void,
        text?: string,
        elm?: Node,
        ns?: string | void,
        context?: Component,
        componentOptions?: VNodeComponentOptions
    )
}

/*export function emptyVNode(): VNode {
    const node = new VNode()
    node.text = ''
    node.isComment = true
    return node
}*/

type VNodeChildren = Array<VNode | string | /*VNodeChildren |*/ null> | string

export interface VNodeComponentOptions {
    Ctor: any//Class<Component>
    propsData: Object | null
    listeners: Object | null
    children: VNodeChildren | null
    tag?: string
}

export interface MountedComponentVNode {
    componentOptions: VNodeComponentOptions
    child: Component
    parent: VNode
    data: VNodeData
}

// interface for vnodes in update modules
export interface VNodeWithData {
    tag: string
    data: VNodeData
    children: Array<VNode> | void
    text: void
    elm: HTMLElement
    ns: string | void
    context: Component
    key: string | number | void
    parent?: VNodeWithData
    child?: Component
    isRootInsert: boolean
}

export interface VNodeData {
    key?: string | number
    slot?: string
    ref?: string
    tag?: string
    staticClass?: string
    class?: any
    style?: Array<Object> | Object
    props?: { [key: string]: any }
    attrs?: { [key: string]: string }
    domProps?: { [key: string]: any }
    hook?: { [key: string]: Function }
    on?: { [key: string]: Function | Array<Function> } | null
    nativeOn?: { [key: string]: Function | Array<Function> }
    transition?: Object
    transitionInjected?: boolean // marker for transition insert hook injection
    show?: boolean // marker for v-show
    inlineTemplate?: {
        render: Function
        staticRenderFns: Array<Function>
    }
    directives?: Array<VNodeDirective>
    keepAlive?: boolean
}

export interface VNodeDirective {
    name: string
    value?: any
    oldValue?: any
    arg?: string
    modifiers?: { [key: string]: boolean }
}
