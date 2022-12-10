
/**
 * Creates a new element with the given tag name.
 * @param {string} name The name of the tag.
 * @example tag('div')
 */
function tag(name) {

  let el = document.createElement(name);

  return empowerElement(el);

}

/**
 * ADD DOCUMENTATION
 */
function svg(name) {

  let el = document.createElementNS('http://www.w3.org/2000/svg', name);

  return empowerElement(el);

}

/**
 * Create a new class selector for the given element.
 * @param {string} name The name of the selector. Use 'end' as a special selector to set the end of the rules.
 * @example sel('.my-class').r('color', 'red').r('font-family', 'Arial').end;
 */
function sel(name){

  const sel = {name: name, rules: {}};

  sel.r = (name, value) => {
    sel.rules[name] = value;
    return sel;
  }

  Object.defineProperty(sel, 'end', {get : () => name + "{" + Object.keys(sel.rules).map(key => key + ": " + sel.rules[key]).join(';') + "}"});

  return sel;
  
}

/**
 * Customize the given element.
 * @param {string} element The element to customize.
 * @function .a(name, value) set an attribute, .s(name, value) set the style, .c(...children) set child/children, .h(html) set the innerHTML, .e(event, callback) set an event listener.
 * @example .tag('div').a('class', 'my-class').c(tag('p').h('Hello World!').s('color', 'red').e('click', () => console.log('Hello World!')))
 */
function empowerElement(el){

  // Attribute
  el.a = (name, value) => {
    el.setAttribute(name, value);
    return el;
  };

  // style
  el.s = (name, value) => {
    el.style[name] = value;
    return el;
  };

  // children
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

  // html
  el.h = (html) => {
    el.innerHTML = html;
    return el;
  };

  // event
  el.e = (event, callback) => {
    el.addEventListener(event, callback);
    return el;
  }

  return el;
}

/**
 * ADD DOCUMENTATION
 */
function getAttributeOrDefault(element, name, defaultValue){
  if (element.hasAttribute(name)) {
    return tryParse(element.getAttribute(name)) || defaultValue;
  } else {
    return defaultValue;
  }
}

/**
 * ADD DOCUMENTATION
 */
function tryParse(json){
  try {
    const obj = JSON.parse(json);
    return obj
    //return JSON.parse(json);
  } catch (error) {
    return json;
  }
}

/**
 * Set the attributes name and value of the given element.
 * @param {string} element The element to set the attributes.
 * @param {string} name The name of the attribute.
 * @param {any} value The value of the attribute.
 */
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