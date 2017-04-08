chrome.runtime.onMessage.addListener(message => {
  console.log(message.data);
});
