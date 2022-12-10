import { sel, tag } from "../../libs/emo-lib";

export class MenuComponent extends HTMLElement {

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
            tag('style').h(this.createCss()),
            tag('div').a('class', 'main').c(
                tag('img').a('src', './emoji/world-smile.svg')
            )
        ]
    }
}

customElements.define("menu-component", MenuComponent);
