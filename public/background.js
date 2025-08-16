chrome.tabs.onUpdated.addListener((tabId, changeInfo, _tab) => {
  if (changeInfo.url) {
    let url = new URL(changeInfo.url);
    if (url.hostname !== 'www.youtube.com') {
      return;
    }

    if (url.pathname === '/watch') {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js'],
      });
    }
  }
});
