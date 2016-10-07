export declare const enum ScreenFlags {
    LAP = 2,
    DESK = 4,
}
export declare const screen: {
    lap: string;
    desk: string;
    wall: string;
    flags: number;
};
export declare function date_columns(): number;
export declare function date_compact_columns(): number;
export declare function table_compact_columns(): number;
export declare const desk_entry: {
    match(): void;
    unmatch(): void;
};
export declare const lap_entry: {
    match(): void;
    unmatch(): void;
};
export declare function registerDefaults(): void;
