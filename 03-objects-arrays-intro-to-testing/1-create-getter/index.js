/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  let subGetter = (obj, subPath) => {
    if (subPath.length && obj) {
      return subGetter(obj[subPath[0]], subPath.slice(1));
    } else {
      return obj;
    }
  };

  return (obj) => subGetter(obj, path.split('.'));
}
