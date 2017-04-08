(function(){
  let short_url = '';
  let div;
  let selection;
  let newRange;
  let ranges;

  function onCopy(event) {
    document.removeEventListener("copy", onCopy);
    const transfer = event.clipboardData;
    transfer.clearData();
    transfer.setData("text/plain", short_url);
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
    browser.runtime.sendMessage({action: "tinyUrl", long_url: document.location.href}).then(response => {
      short_url = response.short_url;
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
        div.append(new Text(short_url));
        document.body.append(div);

        newRange = new Range();
        newRange.selectNodeContents(div);

        selection.addRange(newRange);
        document.addEventListener("copy", onCopy);
        document.execCommand("copy");
      }
    });
  }
})();
