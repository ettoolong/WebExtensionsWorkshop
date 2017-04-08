let preferences = {};
function onCopy(event) {
  document.removeEventListener("copy", onCopy);
  let text = window.getSelection().toString();
  if(preferences.trimSpace) {
    text = text.replace(/^[ \t\f]+|[ \t\f]+$/gm, "");
  }
  if(preferences.removeEmptyLine) {
    text = text.replace(/[\n\r]+/g, "\n");
    text = text.replace(/\n$/,'');
  }
  const transfer = event.clipboardData;
  transfer.clearData();
  transfer.setData("text/plain", text);
  event.preventDefault();
};

chrome.runtime.onMessage.addListener( request => {
  if (request.action === "copyPlainText") {

    chrome.storage.local.get(results => {
      if ((typeof results.length === "number") && (results.length > 0)) {
        results = results[0];
      }
      preferences = results;
      document.addEventListener("copy", onCopy);
      document.execCommand("copy");
    });
  }
});
