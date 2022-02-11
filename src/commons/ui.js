'use strict';

const ui = {
  get(...arg) {
    return chrome.i18n.getMessage(...arg);
  },
  /**
   * Regex replacement method
   * @param {String} pattern pattern string
   * @param {String[]|String} flags flags string array
   * @param {String} str source string
   * @param {String} [replacement] replacement string(defalut empty)
   */
  regReplace(pattern, flags, str, replacement = '') {
    let result = '';
    if (str) {
      let f = '';
      if (Array.isArray(flags)) {
        f = flags.join('');
      } else if (typeof flags === 'string') {
        f = flags;
      }

      try {
        const re = new RegExp(pattern, f);
        result = str.replace(re, replacement);
      } catch (e) {
        console.error(e);
        result = str;
      }
    }
    return result;
  },
  /**
   * Regex test method
   * @param {String} pattern pattern string
   * @param {String[]|String} flags flags string array
   * @param {String} str test string
   */
  regTest(pattern, flags, str) {
    let result = false;
    if (str) {
      let f = '';
      if (Array.isArray(flags)) {
        f = flags.join('');
      } else if (typeof flags === 'string') {
        f = flags;
      }

      try {
        const re = new RegExp(pattern, f);
        result = re.test(str);
      } catch (e) {
        console.error(e);
        result = false;
      }
    }
    return result;
  },
};

export default ui;
