(function(){
  let plainText = '';
  let div;
  let selection;
  let newRange;
  let ranges;

  function onCopy(event) {
    document.removeEventListener("copy", onCopy);
    const transfer = event.clipboardData;
    transfer.clearData();
    transfer.setData("text/plain", plainText);
    event.preventDefault();
    selection.removeRange(newRange);
    div.remove();
    // restore previous selection (if any)
    if (ranges.length > 0) {
      for (var range of ranges) {
        selection.addRange(range);
      }
    }
  };
  if(window.self === window.top) { //this message only handle by top window.
    browser.runtime.sendMessage({action: "convertToPlainText"}).then(response => {
      plainText = response.text;
      if(response) {
        ranges  = [];
        selection = window.getSelection();
        if (!selection.isCollapsed) {
          for (var i = 0; i < selection.rangeCount; i++) {
            ranges.push(selection.getRangeAt(i));
          }
        }
        selection.removeAllRanges();

        div = document.createElement("div");
        div.append(new Text(plainText));
        document.body.append(div);

        newRange = new Range();
        newRange.selectNodeContents(div);

        selection.addRange(newRange);
        document.addEventListener('copy', onCopy);
        document.execCommand("copy");
      }
    });
  }
})();
