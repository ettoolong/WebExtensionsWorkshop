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

let defaultPreference = {
  trimSpace: true,
  removeEmptyLine: true,
  version: 1
};

const loadPreference = () => {
  chrome.storage.local.get(results => {
    if ((typeof results.length === "number") && (results.length > 0)) {
      results = results[0];
    }
    if (!results.version) {
      chrome.storage.local.set(defaultPreference);
    }
  });
};

window.addEventListener("DOMContentLoaded", event => {
  loadPreference();
});
