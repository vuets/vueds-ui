/**
 * Helper function for iterating over a collection
 *
 * @param collection
 * @param fn
 */
/**
 * Helper function for determining whether target object is a function
 *
 * @param target the object under test
 * @return {Boolean} true if function, false otherwise
 */
export interface Opts {
    match: Function;
    unmatch?: Function;
    setup?: Function;
    destroy?: Function;
    deferSetup?: boolean;
}
/**
 * Registers a handler for the given media query.
 */
export declare class MediaQueryRegistry {
    private queries;
    private browserIsIncapable;
    constructor();
    register(q: string, entry: Opts, shouldDegrade?: boolean): this;
    unregister(q: string, entry?: Opts): this;
}
declare var _default: MediaQueryRegistry;
export default _default;
