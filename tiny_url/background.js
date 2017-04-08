//Create short URL
const showNotification = message => {
  chrome.notifications.create("TinyUrl", {
    "type": "basic",
    "iconUrl": "icon/icon.svg",
    "title": "Tiny URL",
    "message": message
  });
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

const makeShortURL = (long_url, callback) => {
  //Encode URL
  let url = encodeURIComponent(long_url);
  let apiUrl = "https://tinyurl.com/api-create.php?url=" + url;
  const onComplete = event => {
    let short_url = event.target.responseText;
    if(typeof(callback) === "function"){
      callback(short_url);
    }
    // console.log("short_url = " + short_url);
    // console.log("long_url = " + long_url);
    showNotification(`${short_url} has been copied to the clipboard.  Shortened from ${long_url}`);
  }

  const onError = err => {
    callback("");
    showNotification("Short URL creation failed");
  }
  let request = new XMLHttpRequest();
  request.onload = onComplete;
  request.onerror = onError;
  request.open("GET", apiUrl, true);
  request.send();
};

chrome.pageAction.onClicked.addListener(tab => {
  makeShortURL( tab.url, short_url => {
    setClipData(short_url);
  });
});

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
  chrome.tabs.get(tabId, tab => {
    if(tab.url.length <= 26) {
      chrome.pageAction.hide(tab.id);
    }
    else {
      chrome.pageAction.show(tab.id);
    }
  });
});
