"use strict"

import * as L from 'leaflet';
import { getAttributeOrDefault, sel, tag } from "../../libs/emo-lib";


export class MapComponent extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.baseUrl = getAttributeOrDefault(this, 'base-url');
    this.emojiUrl = getAttributeOrDefault(this, 'emoji-url');
    this.theme = getAttributeOrDefault(this, 'theme-config', { type: 'light', backgroundColor: 'white', contrastColor: '#313131' })
    this.configComponent(this.baseUrl, this.emojiUrl);
  }

  configComponent(baseUrl, emojiUrl) {
    const fetches = [fetch(baseUrl).then(resp => resp.json()), fetch(emojiUrl).then(resp => resp.json())];
    Promise.all(fetches).then(([baseConfig, emojiConfig]) => {
      const mapDiv = tag('div').a('id', 'map');
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.append(...this.createHtml(mapDiv));
      this.initMap(mapDiv, baseConfig, emojiConfig, this.theme.type);
    });
  }

  createHtml(mapDiv) {
    return [
      tag('style').h('@import  url("./public/leaflet.css")'),
      tag('style').h(this.createCss()),
      mapDiv
    ]
  }

  createCss() {
    return sel('#map')
           .r('height', '100%')
           .r('width', '100%')
           .end +
           sel('.leaflet-container-attribution')
           .r('background-color', this.theme.backgroundColor + ' !important')
           .r('color', this.theme.contrastColor + ' !important')
           .end +
           sel('.leaflet-bar')
           .r('border','1px solid' + this.theme.contrastColor + ' !important')
           .end +
           sel('.leaflet-bar a')
           .r('background-color', this.theme.backgroundColor + ' !important')
           .r('color', this.theme.contrastColor + ' !important')
           .r('border-bottom-color', this.theme.contrastColor + ' !important')
           .end;
  }

  async getBaseMapConfig(config, type) {
    return config[type] || config['default'];
  }

  initMap(mapDiv, baseConfig, emojiConfig, type) {
    
    var map = L.map(mapDiv, {
      center: [44.409, 8.927],
      zoom: 14
    });

    const config = this.getBaseMapConfig(baseConfig, type);

    L.tileLayer(config.url, { attribution: config.attribution}).addTo(map);
  }

}

customElements.define("map-component", MapComponent);