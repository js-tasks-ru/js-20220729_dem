/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }
  return [...string].filter((char, ind) => {
    for (let i = ind; i < ind + size; i++) {
      if (string[i] !== string[i + 1]) {
        return true;
      }
    }
    return false;
  }).join('');
}
