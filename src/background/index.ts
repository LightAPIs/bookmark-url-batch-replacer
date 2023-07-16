import action from '@/common/action';

action.onClicked.addListener(() => {
  if (!chrome.runtime.lastError) {
    chrome.tabs.create({
      url: './src/index/index.html',
    });
  }
});
