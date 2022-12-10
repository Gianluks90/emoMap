import { sel, tag } from "../../libs/emo-lib";

class MenuComponent extends HTMLElement {

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
    return
  }

  createHtml() {
    return [

    ]
  }
}

customElements.define("credits-component", CreditsComponent);
