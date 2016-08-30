export interface Key {
    code: number;
}
export interface Chains {
    preventDefault: boolean;
    handlers?: any[];
}
export declare const bindings: Chains;
export declare function parse(keystring: any): Key;
export declare function stringify(key: Key): string;
export declare function $(scope: string, keychain: string | string[], fn: any, options?: any): void;
export declare function setScope(scope: any): void;
export declare function clearScope(): void;
export declare function getScope(): string;
export declare function pushScope(scope: any): string;
export declare function popScope(scope: any): any;
export declare function isDefmod(e: any): any;
