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
        return sel('.header-el')
            .r('width', '50px').end
            + sel('.main-container')
                .r('display', 'flex')
                .r('flex-direction', 'column')
                .r('justify-content', 'center')
                .r('align-items', 'center').end
    }

    createHtml() {
        return [
            tag('style').h(this.createCss()),
            tag('style').h("@import url('./public/em-style.css')"),
            tag('div').a('class', 'main-container').c(
                tag('div').a('em-header', '').a('class', 'header-el').c(
                    tag('img').a('src', './emoji/world-smile.svg')
                ),
                tag('button').a('em-button-square', '').a('class', 'credit-el').c(
                    tag('img').a('src', './icons/credits.svg') //TODO: credits icons is temporary
                )
            )
        ]
    }
}

customElements.define("menu-component", MenuComponent);