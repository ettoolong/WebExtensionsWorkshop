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

const setClipData = text => {
  let div, newRange, selection;
  let onCopy = event => {
    document.removeEventListener("copy", onCopy);
    const transfer = event.clipboardData;
    transfer.clearData();
    transfer.setData("text/plain", text);
    event.preventDefault();
    div.remove();
  }
  selection = window.getSelection();
  selection.removeAllRanges();

  div = document.createElement("div");
  div.append(new Text(text));
  document.body.append(div);

  newRange = new Range();
  newRange.selectNodeContents(div);

  selection.addRange(newRange);
  document.addEventListener("copy", onCopy);
  setTimeout( function () {
    document.execCommand("copy");
  },0);
};

chrome.browserAction.onClicked.addListener(tab => {
  getClipData( text => {
    if(text) {
      if(addonPrefs.trimSpace) {
        text = text.replace(/^[ \t\f]+|[ \t\f]+$/gm, "");
      }
      if(addonPrefs.removeEmptyLine) {
        text = text.replace(/[\n\r]+/g, "\n");
        text = text.replace(/\n$/,'');
      }
      setClipData(text);
    }
  });
});
