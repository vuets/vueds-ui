/// <reference types="vue" />
export declare function locateNode(vnode: any): VNodeWithData;
export interface PropOptions {
    type: Function | Array<Function> | null;
    default: any;
    required: boolean | null;
    validator: Function | null;
}
export interface ComponentOptions {
    data: Object | Function | void;
    props?: {
        [key: string]: PropOptions;
    };
    propsData?: Object | null;
    computed?: {
        [key: string]: Function | {
            get?: Function;
            set?: Function;
            cache?: boolean;
        };
    };
    methods?: {
        [key: string]: Function;
    };
    watch?: {
        [key: string]: Function | string;
    };
    el?: string | Element;
    template?: string;
    render: () => VNode;
    staticRenderFns?: Array<() => VNode>;
    init?: Function;
    created?: Function;
    beforeMount?: Function;
    mounted?: Function;
    beforeUpdate?: Function;
    updated?: Function;
    directives?: {
        [key: string]: Object;
    };
    transitions?: {
        [key: string]: Object;
    };
    filters?: {
        [key: string]: Function;
    };
    parent?: Component;
    mixins?: Array<Object>;
    name?: string;
    delimiters?: [string, string];
    _isComponent?: boolean;
    _propKeys?: Array<string>;
    _parentVnode?: VNode;
    _parentListeners?: Object | null;
    _renderChildren?: VNodeChildren | null;
}
export declare class Dep {
    static target: Watcher | null;
    id: number;
    subs: Array<Watcher>;
}
export declare class Set {
    set: Object;
    has(key: string | number): boolean;
    add(key: string | number): any;
    clear(): any;
}
export declare class Watcher {
    vm: Component;
    expression: string;
    cb: Function;
    id: number;
    deep: boolean;
    user: boolean;
    lazy: boolean;
    sync: boolean;
    dirty: boolean;
    active: boolean;
    deps: Array<Dep>;
    newDeps: Array<Dep>;
    depIds: Set;
    newDepIds: Set;
    getter: Function;
    value: any;
    constructor(vm: Component, expOrFn: string | Function, cb: Function, options: Object);
}
export declare class Component {
    static cid: number;
    static options: Object;
    static extend: (options: Object) => Function;
    static superOptions: Object;
    static extendOptions: Object;
    static directive: (id: string, def?: Function | Object) => Function | Object | void;
    static filter: (id: string, def?: Function) => Function | void;
    $el: any;
    $data: Object;
    $options: ComponentOptions;
    $parent: Component | void;
    $root: Component;
    $children: Array<Component>;
    $refs: {
        [key: string]: Component | Element | Array<Component | Element> | void;
    };
    $slots: {
        [key: string]: Array<VNode>;
    };
    $vnode: VNode;
    $isServer: boolean;
    $mount: (el?: Element | string, hydrating?: boolean) => Component;
    $forceUpdate: () => void;
    $destroy: () => void;
    $set: (obj: Array<any> | Object, key: any, val: any) => void;
    $delete: (obj: Object, key: string) => void;
    $watch: (expOrFn: string | Function, cb: Function, options?: Object) => Function;
    $on: (event: string, fn: Function) => Component;
    $once: (event: string, fn: Function) => Component;
    $off: (event?: string, fn?: Function) => Component;
    $emit: (event: string, ...args: Array<any>) => Component;
    $nextTick: (fn: Function) => void;
    $createElement: (tag?: string | Component, data?: Object, children?: VNodeChildren, namespace?: string) => VNode;
    _uid: number;
    _isVue: boolean;
    _self: Component;
    _renderProxy: Component;
    _renderParent: Component | null;
    _watcher: Watcher;
    _watchers: Array<Watcher>;
    _data: Object;
    _events: Object;
    _inactive: boolean;
    _isMounted: boolean;
    _isDestroyed: boolean;
    _isBeingDestroyed: boolean;
    _vnode: VNode | null;
    _staticTrees: Array<VNode> | null;
}
export declare class VNode {
    tag: string | void;
    data: VNodeData | void;
    children: Array<VNode> | void;
    text: string | void;
    elm: Node | void;
    ns: string | void;
    context: Component | void;
    key: string | number | void;
    componentOptions: VNodeComponentOptions | void;
    child: Component | void;
    parent: VNode | void;
    raw: boolean | null;
    isStatic: boolean | null;
    isRootInsert: boolean;
    isComment: boolean;
    constructor(tag?: string, data?: VNodeData, children?: Array<VNode> | void, text?: string, elm?: Node, ns?: string | void, context?: Component, componentOptions?: VNodeComponentOptions);
}
export declare type VNodeChildren = Array<VNode | string | null> | string;
export interface VNodeComponentOptions {
    Ctor: any;
    propsData: Object | null;
    listeners: Object | null;
    children: VNodeChildren | null;
    tag?: string;
}
export interface MountedComponentVNode {
    componentOptions: VNodeComponentOptions;
    child: Component;
    parent: VNode;
    data: VNodeData;
}
export interface VNodeWithData {
    tag: string;
    data: VNodeData;
    children: Array<VNode> | void;
    text: void;
    elm: HTMLElement;
    ns: string | void;
    context: Component;
    key: string | number | void;
    parent?: VNodeWithData;
    child?: Component;
    isRootInsert: boolean;
}
export interface VNodeData {
    key?: string | number;
    slot?: string;
    ref?: string;
    tag?: string;
    staticClass?: string;
    class?: any;
    style?: Array<Object> | Object;
    props?: {
        [key: string]: any;
    };
    attrs?: {
        [key: string]: string;
    };
    domProps?: {
        [key: string]: any;
    };
    hook?: {
        [key: string]: Function;
    };
    on?: {
        [key: string]: Function | Array<Function>;
    } | null;
    nativeOn?: {
        [key: string]: Function | Array<Function>;
    };
    transition?: Object;
    transitionInjected?: boolean;
    show?: boolean;
    inlineTemplate?: {
        render: Function;
        staticRenderFns: Array<Function>;
    };
    directives?: Array<VNodeDirective>;
    keepAlive?: boolean;
}
export interface VNodeDirective {
    name: string;
    value?: any;
    oldValue?: any;
    arg?: string;
    modifiers?: {
        [key: string]: boolean;
    };
}
