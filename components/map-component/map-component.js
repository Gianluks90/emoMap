"use strict"

import WCService from "../../services/wc-service";
import * as L from 'leaflet';


export class MapComponent extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.baseUrl = WCService.getAttributeOrDefault(this, 'base-url', null);
    this.theme = WCService.getAttributeOrDefault(this, 'theme-config', { type: 'light', backgroundColor: 'white', contrastColor: '#313131' })
    this.shadowRoot.append(...this.html());
    this.getBaseMapConfig(this.baseUrl, this.theme.type).then(config => {
      this.initMap(config);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }

  css() {
    return WCService.selector('#map', { 'width' : '100%', 'height' : '100%' })+
    WCService.selector('.leaflet-control-attribution', { 'background-color' : this.theme.backgroundColor + ' !important', 'color' : this.theme.contrastColor + ' !important'})+
    WCService.selector('.leaflet-bar', { 'border' : '1px solid' + this.theme.contrastColor + ' !important' })+
    WCService.selector('.leaflet-bar a', { 'background-color' : this.theme.backgroundColor + ' !important', 'color' : this.theme.contrastColor + ' !important', 'border-bottom-color': + this.theme.contrastColor + ' !important' })
  }

  html() {
    return [
      WCService.tag('style', null, null, this.css()),
      WCService.tag('style', null, null, '@import  url("./public/leaflet.css")'),
      WCService.tag('div', { id: "map" }, null, null)
    ]
  }

  static get observedAttributes() { return ['c', 'l']; }

  async getBaseMapConfig(url, type) {
    console.log('attribute', url);
    const baseConfig = await fetch(url).then(resp => resp.json());
    return baseConfig[type] || baseConfig['default'];
  }

  initMap(config) {
    console.log('config received', config);
    const mapElement = this.shadowRoot.getElementById('map');
    var map = L.map(mapElement, {
      center: [44.409, 8.927],
      zoom: 14
    });

    const baseLayer = L.tileLayer(config.url, { attribution: config.attribution}).addTo(map);
  }

}

customElements.define("map-component", MapComponent);