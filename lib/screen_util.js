import enquire from './enquire';
export var screen = {
    lap: 'screen and (min-width:48em)',
    desk: 'screen and (min-width:62em)',
    wall: 'screen and (min-width:75em)',
    flags: 0
};
export function date_columns() {
    var flags = screen.flags;
    if (flags === 0)
        return 2;
    else if (flags & 4)
        return 14;
    else
        return 7;
}
export function date_compact_columns() {
    var flags = screen.flags;
    if (flags === 0)
        return 3;
    else if (flags & 4)
        return 16;
    else
        return 9;
}
export function table_compact_columns() {
    var flags = screen.flags;
    if (flags === 0)
        return 4;
    else if (flags & 4)
        return 12;
    else
        return 6;
}
export var desk_entry = {
    match: function () {
        screen.flags |= 4;
    },
    unmatch: function () {
        screen.flags ^= 4;
    }
};
export var lap_entry = {
    match: function () {
        screen.flags |= 2;
    },
    unmatch: function () {
        screen.flags ^= 2;
    }
};
export function registerDefaults() {
    enquire.register(screen.desk, desk_entry);
    enquire.register(screen.lap, lap_entry);
}
//# sourceMappingURL=screen_util.js.map