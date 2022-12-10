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
    this.cdSwitch = true;
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
    .r('transition', '1s')
    .r('bottom', '0px').end +
    // .r('height', '100%')
    // .r('width', '100%')
    // .r('text-align', 'center').end + 
    sel('.button-container')
    // .r('height', '120px')
    .r('width', "100%")
    .r('display', 'none')
    // .r('display', 'none')
    // .r('flex-wrap', 'wrap')
    .r('justify-content', 'space-evenly')
    .r('margin-bottom', '4px').end + 
    sel('.emoji-buttons')
    .r('height', '40px')
    .r('width', "40px")
    .r('margin', '10px')
    .r('display', 'flex')
    .r('align-items', 'center')
    .r('justify-content', 'center').end +
    sel('.text-input-container')
    .r('display', 'none')
    .r('margin-top', '10px')
    .r('margin-bottom', '10px').end +
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
        tag('p').a('em-title', '').a('id', 'title').h('HOW ARE YOU TODAY?'),
        // tag('div').a('class', 'button-container').a('id', 'b-cont').c(...this.initButtons()),
        tag('div').a('class', 'button-container').a('id', 'b-cont-a').c(...this.populateEmojis()[0]),
        tag('div').a('class', 'button-container').a('id', 'b-cont-b').c(...this.populateEmojis()[1]),
        tag('div').a('class', 'text-input-container').a('id', 't-cont').c(
          tag('textarea').a('em-textarea', '').a('id', 'textfield').a('rows', 3).a('maxlength', 140)
            .a('placeholder', 'Describe it!')
        ),
         tag('div').a('class', 'confirmation-container').a('id', 'c-cont').c(
          tag('button').a('em-button-square', '').e('click', (e) => this.cancelAndReset(e)).c(
            tag('img').a('src', "./emoji/delete.svg").a('class', 'buttons-img')
          ),
          tag('button').a('em-button-square', '').a('class','confirm-button').e('click', (e) => this.sendInfos(e)).c(
            tag('img').a('src', "./emoji/ok.svg").a('class', 'buttons-img')
          )
         )
      ).a('em-card', '').e('click', (e) => this.startingClick(e))
    ]
  }

  initButtons(){
    let buttonArray = [];
    for (let i = 0; i < 10; i++) {
      buttonArray.push(tag('button').a('em-button-square', '').a('id', i).e('click', (e) => this.selectEmoji(this.allEmoji[i],e)).c(
        tag('img').a('src', this.allEmoji[i].url).a('class', 'buttons-img')
      ))
    }
    return buttonArray;
  }

  populateEmojis(){
    let newButtons = [...this.initButtons()];
    const half = Math.ceil(newButtons.length / 2);    

    const firstHalf = newButtons.slice(0, half);
    const secondHalf = newButtons.slice(half);
    return [firstHalf, secondHalf]
  }

  selectEmoji(emoji, e){
    this.selectedEmoji = emoji.code;
    this.textbox = this.shadowRoot.getElementById('t-cont');
    this.confirm = this.shadowRoot.getElementById('c-cont');
    this.textbox.style.display = "flex";
    this.confirm.style.display = "flex";
    e.stopPropagation();
  }

  sendInfos(e){
    const message = this.shadowRoot.getElementById('textfield').value;
    // const loc = LocationService.getLocation()
    // const location = [loc.lng, loc.lat];

    const pos = LocationService.instance().position;
    const info = { timestamp: new Date(), emoji: parseInt(this.selectedEmoji), message: message, latLon: [pos.coords.longitude, pos.coords.latitude], userID: "Nicolò" }
    FirebaseService.instance().setEmotion(info);
    this.setUpCountdown(new Date().getTime());
    this.cancelAndReset(e);
  }

  startingClick(){
    const buttonCont = this.shadowRoot.getElementById('b-cont-a');
    const buttonContB = this.shadowRoot.getElementById('b-cont-b');
    const mainCard = this.shadowRoot.getElementById('main-card');
    buttonCont.style.display = "flex";
    buttonContB.style.display = "flex";
    mainCard.style.cursor = "auto";
  }

  cancelAndReset(e){
    const buttonCont = this.shadowRoot.getElementById('b-cont-a');
    const buttonContB = this.shadowRoot.getElementById('b-cont-b');
    const mainCard = this.shadowRoot.getElementById('main-card');
    buttonCont.style.display = "none";
    buttonContB.style.display = "none";
    mainCard.style.cursor = "pointer";
    this.textbox.style.display = "none";
    this.confirm.style.display = "none";

    e.stopPropagation();
  }

  setUpCountdown(inputDate){
    this.cdSwitch = false;
    const inputTime = inputDate;
    let title = this.shadowRoot.getElementById('title');
    title.innerHTML = "24 : 00 : 00";
    let secondsInterval = setInterval(() => {
      let cdEnd = new Date(new Date().getTime() + 60 * 60 * 24 * 1000).getTime();
  
      let distance = cdEnd - inputTime;
      let hours = 23 - Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = 59 - Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = 60 - Math.floor((distance % (1000 * 60)) / 1000);
      title.innerHTML = hours + " : " + minutes + " : " + seconds;
      if (hours === 0 && minutes === 0 && seconds === 0) {
        this.cdSwitch = true;
        title.innerHTML = 'HOW ARE YOU TODAY?';
        clearInterval(secondsInterval)
      }
    }, 1000);
  }
  static get observedAttributes() { return []; }
}



customElements.define("input-component", InputComponent);