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
    .r('cursor', 'pointer')
    .r('transition', '1s').end +
    // .r('height', '100%')
    // .r('width', '100%')
    // .r('text-align', 'center').end + 
    sel('.button-container')
    .r('height', '120px')
    .r('width', "100%")
    // .r('display', 'flex')
    .r('display', 'none')
    .r('flex-wrap', 'wrap')
    .r('justify-content', 'space-evenly')
    .r('margin-bottom', '20px').end + 
    sel('.emoji-buttons')
    .r('height', '40px')
    .r('width', "40px")
    .r('margin', '10px')
    .r('display', 'flex')
    .r('align-items', 'center')
    .r('justify-content', 'center').end +
    sel('.text-input-container')
    .r('display', 'none')
    .r('margin-bottom', '20px').end +
    sel('.buttons-img')
      .r('height', '34px')
      .r('width', '34px').end + 
    sel('.confirmation-container')
    .r("width", "100%")
    .r('height', "60px")
    .r("margin", "0px 10px 0px auto")
    .r('right', '4%')
    // .r('display', 'flex')
    .r('display', 'none')
    .r('justify-content', 'flex-end').end + 
    sel('.close-button')
    .r('margin-left', '10px')
    .r('width', '60px')
    .r('height', '60px').end + 
    sel('.confirm-button')
    .r('margin-left', '10px').end;
  }
  
  html(){
    return [
      tag('style').h(this.css()),
      tag('style').h("@import url('../../public/em-style.css')"),
      tag('div').a('class', 'main').a('id', 'main-card').c(
        tag('p').a('em-title', '').h('HOW ARE YOU TODAY?'),
        tag('div').a('class', 'button-container').a('id', 'b-cont').c(...this.initButtons()),
        tag('div').a('class', 'text-input-container').a('id', 't-cont').c(
          tag('textarea')
            .a('em-textarea', '')
            .a('id', 'textfield')
            .a('rows', '1')
            .a('max-rows', '2')
            .a('placeholder', 'Describe it!')
        ),
         tag('div').a('class', 'confirmation-container').a('id', 'c-cont').c(
          tag('button').a('em-button-square', '').e('click', (e) => this.cancelAndReset(e)).h('X'),
          tag('button').a('em-button-square', '').a('class','confirm-button').e('click', () => this.sendInfos()).h('OK')
         )
      ).a('em-card', '').e('click', (e) => this.startingClick(e))
    ]
  }

  initButtons(){
    let buttonArray = [];
    for (let i = 0; i < 10; i++) {
      buttonArray.push(tag('button').a('em-button-square', '').a('id', i).e('click', () => this.selectEmoji(this.allEmoji[i])).c(
        tag('img').a('src', this.allEmoji[i].url).a('class', 'buttons-img')
      ))
    }
    return buttonArray;
  }

  selectEmoji(emoji){
    this.selectedEmoji = emoji.code;
    this.textbox = this.shadowRoot.getElementById('t-cont');
    this.confirm = this.shadowRoot.getElementById('c-cont');
    this.textbox.style.display = "flex";
    this.confirm.style.display = "flex";
  }

  sendInfos(){
    const message = this.shadowRoot.getElementById('textfield').value;
    // const loc = LocationService.getLocation()
    // const location = [loc.lng, loc.lat];

    const pos = LocationService.instance().position;
    const info = { timestamp: new Date(), emoji: parseInt(this.selectedEmoji), message: message, latLon: [pos.coords.longitude, pos.coords.latitude], userID: "Nicolò" }
    FirebaseService.instance().setEmotion(info);
    this.cancelAndReset()
  }

  startingClick(){
    const buttonCont = this.shadowRoot.getElementById('b-cont');
    const mainCard = this.shadowRoot.getElementById('main-card');
    buttonCont.style.display = "flex";
    mainCard.style.cursor = "auto";
  }

  cancelAndReset(e){
    const buttonCont = this.shadowRoot.getElementById('b-cont');
    const mainCard = this.shadowRoot.getElementById('main-card');
    buttonCont.style.display = "none";
    mainCard.style.cursor = "pointer";
    this.textbox.style.display = "none";
    this.confirm.style.display = "none";

    e.stopPropagation();
  }

  static get observedAttributes() { return []; }
}



customElements.define("input-component", InputComponent);