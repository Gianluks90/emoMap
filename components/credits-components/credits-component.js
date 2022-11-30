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
      tag('ul').c(
        tag('li').h('Pippo'),
        tag('li').h('Pluto'),
        tag('li').h('Paperino')
      )
    ]
  }
}

customElements.define("credits-component", CreditsComponent);
