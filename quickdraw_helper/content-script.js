const insertAfter = (newNode, referenceNode) => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

const cleanup = () => {
  let node = document.getElementById("translation-word");
  if(node) {
    node.parentNode.removeChild(node);
  }
};

// configuration of the observer:
let config = { childList: true };
let target = document.getElementById("challengetext-word");
let observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    browser.runtime.sendMessage({action: "challengetext", text: mutation.target.textContent}).then(response => {
      //console.log(JSON.stringify(response, null, 4));
      if(response) {
        cleanup();
        let textNode = document.createTextNode(response.text);
        let node = document.createElement("span");
        node.setAttribute("id", "translation-word");
        node.appendChild(textNode);
        insertAfter(node, target);
      }
    });
  });
});
// pass in the target node, as well as the observer options
observer.observe(target, config);
