window.addEventListener("click", event => {
  chrome.runtime.sendMessage({data: document.title + ": hello world"});
});
