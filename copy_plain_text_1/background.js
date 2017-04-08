browser.contextMenus.create({
  type: "normal",
  title: "Copy Plain Text",
  contexts: ["selection"],
  onclick: (info, tab) => {
    if(tab) {
      browser.tabs.sendMessage(tab.id, {action: "copyPlainText"});
    }
  }
});
