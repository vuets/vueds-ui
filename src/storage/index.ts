import * as stub from './stub'
export { on, off } from './tracking'

const ls = window.localStorage || stub

/*function accessor (key, value) {
  if (arguments.length === 1) {
    return get(key);
  }
  return set(key, value);
}*/

export function get(key) {
    return JSON.parse(ls.getItem(key))
}

export function set(key, value) {
    try {
        ls.setItem(key, JSON.stringify(value))
        return true
    } catch (e) {
        return false
    }
}

export function remove(key) {
    return ls.removeItem(key)
}

export function clear() {
    return ls.clear()
}
