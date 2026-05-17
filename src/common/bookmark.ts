import { regTest, regReplace, normalTest, normalReplace } from './replace';

function arrayHandler(
  arr: chrome.bookmarks.BookmarkTreeNode[],
  pattern: string,
  flags: string,
  replacement: string,
  isRegex: boolean,
  replaceCount: number,
): DataItem[] {
  const data: DataItem[] = [];
  if (arr) {
    arr.forEach(item => {
      if (item.children && item.children.length > 0) {
        data.push(...arrayHandler(item.children, pattern, flags, replacement, isRegex, replaceCount));
      } else {
        const { id, title, url } = item;
        if (url) {
          const matched = isRegex ? regTest(pattern, flags, url) : normalTest(pattern, url);
          if (matched) {
            const result = isRegex ? regReplace(pattern, flags, url, replacement) : normalReplace(pattern, url, replacement, replaceCount);
            data.push({
              key: id,
              name: title,
              source: url,
              result,
            });
          }
        }
      }
    });
  }

  return data;
}

export async function getTree(pattern: string, flags: string[] | string, replacement: string, isRegex = true, replaceCount = 0): Promise<DataItem[]> {
  let f = '';
  if (Array.isArray(flags)) {
    f = flags.join('');
  } else if (typeof flags === 'string') {
    f = flags;
  }
  if (f.includes('v')) {
    f = f.replace(/u/g, '');
  }

  const arr = await chrome.bookmarks.getTree(); //! chrome 90+
  if (arr.length > 0) {
    const treeData = arr[0].children;
    if (treeData) {
      return arrayHandler(treeData, pattern, f, replacement, isRegex, replaceCount);
    }
  }
  return [];
}

export async function updateUrl(id: string, newUrl: string) {
  //! chrome 90+
  return await chrome.bookmarks.update(id, {
    url: newUrl,
  });
}
