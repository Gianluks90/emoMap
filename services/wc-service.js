"use strict"

export default class WCService{

  static getAttributeOrDefault(element, name, defaultValue){
    if (element.hasAttribute(name)) {
      return WCService.tryParse(element.getAttribute(name)) || defaultValue;
    } else {
      return defaultValue;
    }
  }

  static tryParse(json){
    try {
      return JSON.parse(json);
    } catch (error) {
      console.log('error', error)
      return json;
    }
  }

  static setAttribute(element, name, value){
    if (typeof value === "string") {
      element.setAttribute(name, value);
      return value;
    } else {
      const valueString = JSON.stringify(value);
      element.setAttribute(name, valueString);
      return valueString;
    }
  }

  static tag(name, attributes, listeners, innerHtml, children){
    let el = document.createElement(name);
    
    if (attributes) {
      for (const key of Object.keys(attributes)) {
        WCService.setAttribute(el, key, attributes[key], "");
      }
  
    }

    if (listeners) {
      for (const key of Object.keys(listeners)) {
        el.addEventListener(key, listeners[key]);
      }
    }

    if(innerHtml){
      el.innerHTML = innerHtml;
    }

    if (children) {
      el.append(...children);
    }

    return el;

  }
  static selector(name, rules){
    return name +"{"+ Object.keys(rules).map(key => key + ": " + rules[key]).join(';') +"}"
  }


}