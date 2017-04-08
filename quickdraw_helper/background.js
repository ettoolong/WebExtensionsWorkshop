let cache = {};
let cacheList = [];

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.action === "challengetext") {
    //sendResponse({action: "setText", text: "#" + message.text + "#"});
    if(cache[message.text] === undefined) {
      cache[message.text] = "";
      translate("en", "zh-TW", message.text, res => {
        cache[message.text] = res.translation;
        cacheList.push(message.text);
        if(cacheList.length>100) {
          let oldWord = cacheList.shift();
          if(cache[oldWord]) {
            delete cache[oldWord];
          }
        }
        sendResponse({action: "setText", text: res.translation});
      });
      return true;
    }
    else if(cache[message.text] === "") {
      //console.log("ignore");
    }
    else {
      //console.log('use cache: ' + msg.text + ' => ' + cache[msg.text]);
      sendResponse({action: "setText", text: cache[message.text]});
      return true;
    }
  }
});
