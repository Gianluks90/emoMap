
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
 * It creates an SVG element, and then returns the result of calling `empowerElement` on that element
 * @param name - The name of the SVG element to create.
 * @returns A function that takes a name as an argument and returns an element.
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

  sel.toString = () => name + "{" + Object.keys(sel.rules).map(key => key + ": " + sel.rules[key]).join(';') + "}";

  Object.defineProperty(sel, 'end', {get : () => name + "{" + Object.keys(sel.rules).map(key => key + ": " + sel.rules[key]).join(';') + "}"});

  return sel;
}


function selector(name) {
  return sel(name);
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
 * If the element has the attribute, return the attribute's value, otherwise return the default value
 * @param element - The element to get the attribute from.
 * @param name - The name of the attribute to get.
 * @param defaultValue - The default value to return if the attribute is not present.
 * @returns The value of the attribute or the default value if the attribute is not present.
 */
function getAttributeOrDefault(element, name, defaultValue){
  if (element.hasAttribute(name)) {
    return tryParse(element.getAttribute(name)) || defaultValue;
  } else {
    return defaultValue;
  }
}


/**
 * If the string is valid JSON, return the parsed JSON, otherwise return the string
 * @param json - The JSON string to parse.
 * @returns the JSON.parse(json) if it can be parsed, otherwise it returns the json.
 */
function tryParse(json){
  try {
    return JSON.parse(json);
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

function getElement(selector, parent = document) {
  return empowerElement(parent.querySelector(selector));
}

function getElementAll(selector, parent = document) { 
  return empowerElement(parent.querySelectorAll(selector));
}

export {tag, svg, sel, getAttributeOrDefault, tryParse, setAttribute};