'use strict';

if (process.env.VUE_APP_MANIFEST === 'v3') {
  chrome.action.onClicked.addListener(() => {
    if (!chrome.runtime.lastError) {
      chrome.tabs.create({
        url: './index.html',
      });
    }
  });
} else {
  chrome.browserAction.onClicked.addListener(() => {
    if (!chrome.runtime.lastError) {
      chrome.tabs.create({
        url: './index.html',
      });
    }
  });
}
