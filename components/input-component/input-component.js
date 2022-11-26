"use strict"

import WCService from "../../services/wc-service";

export class InputComponent extends HTMLElement {

  constructor() {

    super();
    this.attachShadow({ mode: "open" });

  }

  connectedCallback() {
    this.shadowRoot.append(...this.html())
  }
  

  attributeChangedCallback(name, oldValue, newValue) {
  }

  css(){
    return WCService.selector('.main', {'background-color': 'red'})
  }
  
  html(){
    return [
      WCService.tag('style', null, null, this.css()),
      WCService.tag('div', {class: "main"}, null, null, [
        WCService.tag('a', {href:"http://google.it"}, null, 'google')
      ])
    ]
  }

  static get observedAttributes() { return ['c', 'l']; }


}



customElements.define("input-component", InputComponent);