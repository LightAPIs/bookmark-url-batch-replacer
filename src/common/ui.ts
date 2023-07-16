export function i18n(...arg: string[]) {
  const [arg1, ...rest] = arg;
  return chrome.i18n.getMessage(arg1, rest);
}
