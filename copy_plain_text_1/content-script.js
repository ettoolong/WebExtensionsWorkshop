function onCopy(event) {
  document.removeEventListener("copy", onCopy);
  const transfer = event.clipboardData;
  transfer.clearData();
  transfer.setData("text/plain", window.getSelection().toString());
  event.preventDefault();
};

chrome.runtime.onMessage.addListener( request => {
  if (request.action === "copyPlainText") {
    document.addEventListener("copy", onCopy);
    document.execCommand("copy");
  }
});
