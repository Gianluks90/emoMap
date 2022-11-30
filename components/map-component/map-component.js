"use strict"

import * as L from 'leaflet';
import { getAttributeOrDefault, sel, tag } from "../../libs/emo-lib";
import FirebaseService from '../../services/firebse-service';


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
      this.map = this.initMap(mapDiv, baseConfig, emojiConfig, this.theme.type);
      this.addBaseLayer(this.map, baseConfig, this.theme.type);
      this.addEmotionsLayer(this.map, emojiConfig);
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

  getBaseMapConfig(config, type) {
    return config[type] || config['default'];
  }

  initMap(mapDiv) {

    var map = L.map(mapDiv, {
      center: [44.409, 8.927],
      zoom: 10,
      attributionControl: false,
    });

    return map;
  }

  addBaseLayer(map, baseConfig, type) {

    const config = this.getBaseMapConfig(baseConfig, type);
    L.tileLayer(config.url, { attribution: config.attribution}).addTo(map);

  }

  addEmotionsLayer(map, emojiConfig) {

    FirebaseService.instance().getEmotions((emotions) => {
      L.geoJSON(emotions, {pointToLayer: (feature, latlng) => this.pointToLayer(feature, latlng, emojiConfig)}).addTo(map);
    })
  }

  pointToLayer(feature, latlng, emojiConfig) {
    const icon = L.icon({
      iconUrl: emojiConfig[feature.properties.emoji].url,
      iconSize:     [36, 36],
      iconAnchor:   [18, 18],
      popupAnchor:  [24, 0] // point from which the popup should open relative to the iconAnchor
    });

    return L.marker(latlng, {icon: icon});
  }

}

customElements.define("map-component", MapComponent);