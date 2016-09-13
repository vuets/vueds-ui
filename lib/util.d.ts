import { Trie } from './trie';
export declare function extractFlagsLen(str: string): number;
export declare function newChangeHandler(self: any): (e) => any;
export declare function prevent(e: Event, flags: number): boolean;
export declare function isFlagSet(param: any, flag: number): boolean;
/**
 * Returns the param
 */
export declare function putArgsTo(param: any, array: string[], i: number, flags: number): any;
export declare function newTrie(stem: any, sorting: any): Trie;
