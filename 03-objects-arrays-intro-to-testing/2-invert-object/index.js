/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
import {re} from "@babel/core/lib/vendor/import-meta-resolve";

export function invertObj(obj) {
  if (obj) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
  } else {
    return obj;
  }
}
