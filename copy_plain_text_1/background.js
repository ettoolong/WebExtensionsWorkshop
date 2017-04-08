chrome.contextMenus.create({
  type: "normal",
  title: "Copy Plain Text",
  contexts: ["selection"],
  onclick: (info, tab) => {
    if(tab) {
      chrome.tabs.sendMessage(tab.id, {action: "copyPlainText"});
    }
  }
});
