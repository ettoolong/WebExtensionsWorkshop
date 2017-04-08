let addonPrefs = {trimSpace: true, removeEmptyLine: true};
const getClipData = callback => {
  let textArea = document.getElementById("clipboard");
  let onPaste = event => {
    const transfer = event.clipboardData;
    let pastedData = transfer.getData("Text");
    callback(pastedData);
    document.removeEventListener("paste", onPaste, false);
  }
  let onInput = event => {
    event.target.textContent = '';
    event.target.removeEventListener("input", onInput, false);
  };
  let body = document.querySelector("body");
  if(!textArea) {
    textArea = document.createElement("textarea");
    textArea.setAttribute("id", "clipboard");
    textArea.setAttribute("type", "text");
    textArea.setAttribute("value", '');
    textArea.setAttribute("contenteditable", "true");
    body.appendChild(textArea);
  }
  else {
    textArea.textContent = '';
  }
  textArea.addEventListener("input", onInput, false);
  textArea.focus();
  document.addEventListener("paste", onPaste, false);
  document.execCommand("Paste");
};

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.action === "convertToPlainText") {
    getClipData( text => {
      if(text) {
        if(addonPrefs.trimSpace) {
          text = text.replace(/^[ \t\f]+|[ \t\f]+$/gm, "");
        }
        if(addonPrefs.removeEmptyLine) {
          text = text.replace(/[\n\r]+/g, "\n");
          text = text.replace(/\n$/,'');
        }
        sendResponse({action: "setClipData", text: text});
      }
    });
    return true;
  }
});

browser.browserAction.onClicked.addListener(tab => {
  var executing = browser.tabs.executeScript(tab.id, {
    file: "content-script.js",
    runAt: "document_end"
  });
});
