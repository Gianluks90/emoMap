import { sel, tag } from "../../libs/emo-lib";

class CreditsComponent extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.append(...this.createHtml());
  }

  createCss(){
    return sel('.pippo').r('color', 'red').end;
  }

  createHtml(){
    return [
      tag('style').h(this.createCss()),
      tag('h1').h('Credits'),
      tag('p').a('class', 'pippo')
      .h('This project was created by the following people:').e('click', () => alert('ciao')),
      tag('div').a('class', 'burundi')
      .h('All emojis designed by <a href="https://openmoji.org">OpenMoji</a> – the open-source emoji and icon project. License: <a href="https://creativecommons.org/licenses/by-sa/4.0/#"> CC BY-SA 4.0</a>'),
      tag('div').a('class', 'miao')
      .h('Map was provided by <a href="https://github.com/GreenInfo-Network/Leaflet-Control-Credits/blob/master/LICENSE">Leaflet framework</a>, we love it!'),
      tag('div').a('class', 'bau')
      .h("&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"),
      tag('img').a('src', './socials/E045.svg')
    ]
  }
}

customElements.define("credits-component", CreditsComponent);
