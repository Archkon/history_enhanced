// Keep background script minimal as all functionality is in popup
chrome.runtime.onInstalled.addListener(() => {
  console.log('History Enhanced extension installed');
});