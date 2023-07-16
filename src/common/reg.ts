/**
 * Regex replacement method
 * @param pattern pattern string
 * @param flags flags string array
 * @param str source string
 * @param replacement replacement string(defalut empty)
 */
export function regReplace(pattern: string, flags: string[] | string, str: string, replacement = '') {
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
}

/**
 * Regex test method
 * @param pattern pattern string
 * @param flags flags string array
 * @param str test string
 */
export function regTest(pattern: string, flags: string[] | string, str: string) {
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
}
