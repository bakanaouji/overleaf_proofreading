(async () => {
  await import(chrome.runtime.getURL('./content.js'));
})()