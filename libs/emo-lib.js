

function tag(name) {

  let el = document.createElement(name);

  return empowerElement(el);

}


function svg(name) {

  let el = document.createElementNS('http://www.w3.org/2000/svg', name);

  return empowerElement(el);

}


function sel(name){

  const sel = {name: name, rules: {}};

  sel.r = (name, value) => {
    sel.rules[name] = value;
    return sel;
  }

  Object.defineProperty(sel, 'end', {get : () => name + "{" + Object.keys(sel.rules).map(key => key + ": " + sel.rules[key]).join(';') + "}"});

  return sel;
  
}


function empowerElement(el){

  el.a = (name, value) => {
    el.setAttribute(name, value);
    return el;
  };

  el.s = (name, value) => {
    el.style[name] = value;
    return el;
  };

  el.c = (...children) => {
    children.forEach(child => {
      if (child) {
        if (typeof child === "string") {
          el.appendChild(document.createTextNode(child));
        } else {
          el.appendChild(child);
        }
      }
    });
    return el;
  };

  el.h = (html) => {
    el.innerHTML = html;
    return el;
  };

  el.e = (event, callback) => {
    el.addEventListener(event, callback);
    return el;
  }

  return el;
}

function getAttributeOrDefault(element, name, defaultValue){
  if (element.hasAttribute(name)) {
    return tryParse(element.getAttribute(name)) || defaultValue;
  } else {
    return defaultValue;
  }
}

function tryParse(json){
  try {
    debugger
    const obj = JSON.parse(json);
    return obj
    //return JSON.parse(json);
  } catch (error) {
    return json;
  }
}

function setAttribute(element, name, value){
  if (typeof value === "string") {
    element.setAttribute(name, value);
    return value;
  } else {
    const valueString = JSON.stringify(value);
    element.setAttribute(name, valueString);
    return valueString;
  }
}

export {tag, svg, sel, getAttributeOrDefault, tryParse, setAttribute};