"use strict"

import WCService from "../../services/wc-service";
import LocationService from "../../services/location-service";
import { sel, tag } from "../../libs/emo-lib";

export class InputComponent extends HTMLElement {

  constructor() {

    super();
    this.attachShadow({ mode: "open" });

  }

  connectedCallback() {
    this.themeConfig = WCService.getAttributeOrDefault(this,"theme-config", null);
    this.emojiConfig = WCService.getAttributeOrDefault(this,"emoji-url", null)
    const response = fetch(this.emojiConfig).then(res => res.json()).then(data => {
      this.allEmoji = data
      this.shadowRoot.append(...this.html());
    })
  }
  

  attributeChangedCallback(name, oldValue, newValue) {
  }

  css(){
    return WCService.selector('.main', {'height': '100%' , 'width': '100%', 'text-align': 'center'}) +
    WCService.selector('.button-container', {'height': '120px','width': "100%", 'display': 'flex', 'flex-wrap': 'wrap', 'margin-bottom': '20px'}) + 
    WCService.selector('.emoji-buttons', {'height': '40px','width': "40px", 'margin': '10px', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center'})+
    sel('.buttons-img')
      .r('height', '100%')
      .r('width', '100%')
      .end;
  }
  
  html(){
    return [
      tag('style').h(this.css()),
      tag('div').a('class', 'main').c(
        WCService.tag('p', {class: "input-title"}, null, 'HOW ARE YOU TODAY?', null),
        WCService.tag('div', {class: "button-container"}, null,null, this.initButtons()),
        WCService.tag('div', {class: 'text-input-container'}, null, null, [
          WCService.tag('input', {type: 'text', id: 'textfield'}, null, null, null)
        ]),
        WCService.tag('div', {class: 'confirmation-container'}, null, null, [
          WCService.tag('button', {class: 'confirm-button'}, {'click': () => this.sendInfos()}, 'OK', null),
          WCService.tag('button', {class: 'close-button'}, null, 'X', null)
        ])
      )
    ]
  }

  initButtons(){
    let buttonArray = [];
    for (let i = 0; i < 10; i++) {
      buttonArray.push(WCService.tag('button', {class: 'emoji-buttons', id: i}, {'click': () => this.selectEmoji(this.allEmoji[i])}, null, [WCService.tag('img', {src: this.allEmoji[i].url, class: 'buttons-img'}, null, null, null)]))
    }
    return buttonArray;
  }

  selectEmoji(emoji){
    this.selectedEmoji = emoji.code
  }

  sendInfos(){
    const message = this.shadowRoot.getElementById('textfield').value
    const location = LocationService.getLocation();
    const info = {date: new Date().getTime(), emojiCode: this.selectedEmoji, message: message, location: location}
    console.log(info);
  }

  static get observedAttributes() { return ['c', 'l']; }


}



customElements.define("input-component", InputComponent);