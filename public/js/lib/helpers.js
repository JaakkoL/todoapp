function nonEmpty(x) { return x.length > 0 }

function validEmail(x) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(x);
}

function setVisibility(element, visible) {
  element.toggle(visible)
}

function setEnabled(element, enabled) {
  element.attr("disabled", !enabled)
}
