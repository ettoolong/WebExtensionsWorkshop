window.addEventListener("click", event => {
  browser.runtime.sendMessage({data: document.title + ": hello world"});
});
