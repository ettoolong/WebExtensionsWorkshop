let currentPrefs = {};

const saveToPreference = (id, value) => {
  let update = {};
  update[id] = value;
  browser.storage.local.set(update);
}

const handleVelueChange = id => {
  let elem = document.getElementById(id);
  if(elem) {
    let elemType = elem.getAttribute("type");
    if(elemType === "checkbox") {
      elem.addEventListener("input", event => {
        saveToPreference(id, elem.checked ? true : false);
      });
    }
  }
}

const setValueToElem = (id, value) => {
  let elem = document.getElementById(id);
  if(elem) {
    let elemType = elem.getAttribute("type");
    if(elemType === "checkbox") {
      elem.checked = value;
    }
  }
}

const init = preferences => {
  currentPrefs = preferences;
  for(let p in preferences) {
    setValueToElem(p, preferences[p]);
    handleVelueChange(p);
  }
}

window.addEventListener("load", event => {
  browser.storage.local.get().then(results => {
    if ((typeof results.length === "number") && (results.length > 0)) {
      results = results[0];
    }
    if (results.version) {
      init(results);
    }
  });
}, true);
