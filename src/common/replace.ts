/**
 * Normal replacement method (direct string replacement)
 * @param pattern pattern string
 * @param str source string
 * @param replacement replacement string
 * @param count number of replacements (0 or negative means all)
 */
export function normalReplace(pattern: string, str: string, replacement = '', count = 0) {
  if (!str || !pattern) {
    return str;
  }
  if (count <= 0) {
    return str.split(pattern).join(replacement);
  }
  let result = str;
  for (let i = 0; i < count; i++) {
    const idx = result.indexOf(pattern);
    if (idx === -1) break;
    result = result.substring(0, idx) + replacement + result.substring(idx + pattern.length);
  }
  return result;
}

/**
 * Normal test method
 * @param pattern pattern string
 * @param str test string
 */
export function normalTest(pattern: string, str: string) {
  return str ? str.includes(pattern) : false;
}

/**
 * Regex replacement method
 * @param pattern pattern string
 * @param flags flags string
 * @param str source string
 * @param replacement replacement string(defalut empty)
 */
export function regReplace(pattern: string, flags: string, str: string, replacement = '') {
  let result = '';
  if (str) {
    try {
      const re = new RegExp(pattern, flags);
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
 * @param flags flags string
 * @param str test string
 */
export function regTest(pattern: string, flags: string, str: string) {
  let result = false;
  if (str) {
    try {
      const re = new RegExp(pattern, flags);
      result = re.test(str);
    } catch (e) {
      console.error(e);
      result = false;
    }
  }
  return result;
}
