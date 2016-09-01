import { PojoStore, Pager } from 'vueds/lib/store/';
export declare function selectIdx(idx: number, array: any[], store: PojoStore<any>, clickUpdate: boolean): void;
export declare function pageAndSelectIdx(page: number, idx: number, array: any[], store: PojoStore<any>, clickUpdate: boolean): void;
export declare function tableUp(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean): void;
export declare function tableJumpUp(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean): void;
export declare function tableDown(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean): void;
export declare function tableJumpDown(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean): void;
export declare function tableLeft(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean): void;
export declare function tableJumpLeft(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean): void;
export declare function tableRight(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean): void;
export declare function tableJumpRight(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean): void;