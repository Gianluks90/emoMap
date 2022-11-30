"use strict"

import WCService from "../../services/wc-service";
import LocationService from "../../services/location-service";
import FirebaseService from "../../services/firebse-service";
import { getAttributeOrDefault, sel, tag } from "../../libs/emo-lib";

export class InputComponent extends HTMLElement {

  constructor() {

    super();
    this.attachShadow({ mode: "open" });

  }

  connectedCallback() {
    this.themeConfig = getAttributeOrDefault(this, "theme-config");
    this.emojiConfig = getAttributeOrDefault(this, 'emoji-url');
    const response = fetch(this.emojiConfig).then(res => res.json()).then(data => {
      this.allEmoji = data
      this.shadowRoot.append(...this.html());
    })
  }
  

  attributeChangedCallback(name, oldValue, newValue) {
  }

  css(){
    return sel('.main')
    .r('height', '100%')
    .r('width', '100%')
    .r('text-align', 'center').end + 
    sel('.button-container')
    .r('height', '120px')
    .r('width', "100%")
    .r('display', 'flex')
    .r('flex-wrap', 'wrap')
    .r('margin-bottom', '20px').end + 
    sel('.emoji-buttons')
    .r('height', '40px')
    .r('width', "40px")
    .r('margin', '10px')
    .r('display', 'flex')
    .r('align-items', 'center')
    .r('justify-content', 'center').end +
    sel('.text-input-container').r('margin-bottom', '20px').end +
    sel('.buttons-img')
      .r('height', '34px')
      .r('width', '34px').end + 
    sel('.confirmation-container')
    .r("width", "fit-content")
    .r("margin", "0px 10px 0px auto")
    .r('position', 'absolute')
    .r('bottom', '5%')
    .r('right', '4%').end + 
    sel('.close-button')
    .r('margin-left', '10px')
    .r('width', '60px')
    .r('height', '60px').end + 
    sel('.confirm-button')
    .r('margin-left', '10px')
    .r('width', '60px')
    .r('height', '60px').end;;
  }
  
  html(){
    return [
      tag('style').h(this.css()),
      tag('div').a('class', 'main').c(
        tag('p').a('class', 'input-title').h('HOW ARE YOU TODAY?'),
        tag('div').a('class', 'button-container').c(...this.initButtons()),
        tag('div').a('class', 'text-input-container').c(
          tag('input').a('type', 'text').a('id', 'textfield')
        ),
        tag('div').a('class', 'confirmation-container').c(
          tag('button').a('class', 'confirm-button').e('click', () => this.sendInfos()).h('OK'),
          tag('button').a('class', 'close-button').h('X')
        )
      )
    ]
  }

  initButtons(){
    let buttonArray = [];
    for (let i = 0; i < 10; i++) {
      buttonArray.push(tag('button').a('class', 'emoji-buttons').a('id', i).e('click', () => this.selectEmoji(this.allEmoji[i])).c(
        tag('img').a('src', this.allEmoji[i].url).a('class', 'buttons-img')
      ))
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
    //FirebaseService.setEmotion(info)
  }

  static get observedAttributes() { return []; }


}



customElements.define("input-component", InputComponent);