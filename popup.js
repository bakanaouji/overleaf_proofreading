document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("openOptionsPage")?.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});