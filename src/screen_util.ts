import enquire from './enquire'
import { bit_unset } from 'vueds/lib/util'

export const enum ScreenFlags {
    PL = 1,
    LAP = 2,
    DESK = 4
}

export const screen = {
    pl: 'screen and (min-width:33.75em)',
    lap: 'screen and (min-width:48em)',
    desk: 'screen and (min-width:62em)',
    wall: 'screen and (min-width:75em)',
    flags: 0
}

export function date_columns(): number {
    var flags = screen.flags
    if (flags === 0) return 2
    else if (flags & 4) return 14
    else return 7
}
export function date_compact_columns(): number {
    var flags = screen.flags
    if (flags === 0) return 3
    else if (flags & 4) return 16
    else return 9
}
export function table_compact_columns(): number {
    var flags = screen.flags
    if (flags === 0) return 4
    else if (flags & 4) return 12
    else return 6
}

export const desk_entry = {
    match() {
        screen.flags |= ScreenFlags.DESK
    },
    unmatch() {
        screen.flags = bit_unset(screen.flags, ScreenFlags.DESK)
    }
}

export const lap_entry = {
    match() {
        screen.flags |= ScreenFlags.LAP
    },
    unmatch() {
        screen.flags = bit_unset(screen.flags, ScreenFlags.LAP)
    }
}

export const pl_entry = {
    match() {
        screen.flags |= ScreenFlags.PL
    },
    unmatch() {
        screen.flags = bit_unset(screen.flags, ScreenFlags.PL)
    }
}

export function registerDefaults() {
    enquire.register(screen.desk, desk_entry)
    enquire.register(screen.lap, lap_entry)
    enquire.register(screen.pl, pl_entry)
}
