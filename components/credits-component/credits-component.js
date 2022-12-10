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

  createCss() {
    return sel('.credits-el')
      .r('color', 'red').end
      + sel('.main')
        .r('background-color', 'white')
        .r('height', '100vh')
        .r('display', 'flex')
        .r('flex-direction', 'column')
        .r('justify-content', 'center')
        .r('align-items', 'center').end
      + sel('.icon-el')
        .r('width', '100px').end
      + sel('.title-el')
        .r('font-weight', 'bold')
        .r('font-size', 'x-large').end
      + sel('socials-el')
      .r('display', 'flex').end;
  }

  createHtml() {
    return [
      tag('style').h(this.createCss()),
      tag('div').a('class', 'main').c(
        tag('span').a('class', 'title-el')
          .h('Credits'),
        tag('p').a('class', 'credits-el')
          .h('This project was created by the following people:').e('click', () => alert('ciao')),
        tag('div').a('class', 'openmoji-el')
          .h('All emojis designed by <a href="https://openmoji.org">OpenMoji</a> – the open-source emoji and icon project. License: <a href="https://creativecommons.org/licenses/by-sa/4.0/#"> CC BY-SA 4.0</a>'),
        tag('div').a('class', 'leaflet-el')
          .h('Map was provided by <a href="https://github.com/GreenInfo-Network/Leaflet-Control-Credits/blob/master/LICENSE">Leaflet framework</a>, we love it!'),
        tag('div').a('class', 'openStreetMaps-el')
          .h("&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"),
        tag('div').a('class', 'socials-el').c(
          tag('img').a('class', 'icon-el').a('src', './socials/github.svg'),
          tag('img').a('class', 'icon-el').a('src', './socials/twitter.svg'),
          tag('img').a('class', 'icon-el').a('src', './socials/apple.svg'),
          tag('img').a('class', 'icon-el').a('src', './socials/android.svg')
        )
      )
    ]
  }
}

customElements.define("credits-component", CreditsComponent);
