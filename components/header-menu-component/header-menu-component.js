import { tag } from "../../libs/emo-lib";

class HeaderMenuComponent extends HTMLElement {
    
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    html() {
        return tag('div').a('em-card', '').c(
            tag('img').a('src', '../../public/logo.png')
        )
    }

    css() {

    }
}

customElements.define("header-menu-component", HeaderMenuComponent);
