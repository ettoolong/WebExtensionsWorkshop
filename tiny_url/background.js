//Create short URL
const showNotification = message => {
  browser.notifications.create("TinyUrl", {
    "type": "basic",
    "iconUrl": "icon/icon.svg",
    "title": "Tiny URL",
    "message": message
  });
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

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.action === "tinyUrl") {
    makeShortURL( message.long_url, short_url => {
      sendResponse({action: "setClipData", short_url: short_url});
    });
    return true;
  }
});

browser.pageAction.onClicked.addListener(tab => {
  var executing = browser.tabs.executeScript(tab.id, {
    file: "content-script.js",
    runAt: "document_end"
  });
});

browser.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
  browser.tabs.get(tabId).then(tab => {
    if(tab.url.length <= 26) {
      browser.pageAction.hide(tab.id);
    }
    else {
      browser.pageAction.show(tab.id);
    }
  });
});
