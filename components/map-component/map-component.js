"use strict"

import * as L from 'leaflet';
import { getAttributeOrDefault, sel, tag } from "../../libs/emo-lib";
import FirebaseService from '../../services/firebse-service';
import LocationService from '../../services/location-service';

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
      this.addUserPosition(this.map);
      this.addBaseLayer(this.map, baseConfig, this.theme.type);
      this.addEmotionsLayer(this.map, emojiConfig);
    });

  }

  createHtml(mapDiv) {
    return [
      tag('style').h('@import url("./public/leaflet.css")'),
      tag('style').h('@import url("./public/em-style.css")'),
      tag('style').h(this.createCss()),
      tag('div').a('class', 'control-container').c(
        tag('button').a('em-button-square', '').a('class', 'control-button').h('').e('click', () => this.centerClicked()).c(
          tag('img').a('src', './public/icons/plus.svg').a('class', 'control-image')
        ),
        tag('button').a('em-button-square', '').a('class', 'control-button').h('').e('click', () => this.centerClicked()).c(
          tag('img').a('src', './public/icons/minus.svg').a('class', 'control-image')
        ),
        tag('button').a('em-button-square', '').a('class', 'control-button').h('').e('click', () => this.centerClicked()).c(
          tag('img').a('src', './public/icons/center.svg').a('class', 'control-image')
        )
      ),
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
           .end +
           sel('.control-container')
           .r('display', 'flex')
           .r('flex-direction', 'column')
           .r('position', 'absolute')
           .r('top', '0px')
           .r('right', '0px')
           .r('z-index', '2000')
           .r('gap', '6px')
           .r('margin', '12px')
           .end +
           sel('.control-button')
           .r('width', '35px !important')
           .r('height', '35px !important')
           .end + 
           sel('.control-image')
           .r('width', '30px !important')
           .r('height', '30px !important')
           .end
  }

  getBaseMapConfig(config, type) {
    return config[type] || config['default'];
  }

  initMap(mapDiv) {

    var map = L.map(mapDiv, {
      center: [44.409, 8.927],
      zoom: 10,
      attributionControl: false,
      zoomControl: false
    });

    var longpress = false;
    map.on('click', (e)=>{
      var startTime, endTime;

      map.on('mousedown', function () {
          startTime = new Date().getTime();
      });
  
      map.on('mouseup', function () {
          endTime = new Date().getTime();
          longpress = (endTime - startTime < 500) ? false : true;
      });

      longpress? console.log("Long Press", e.latlng) : console.log("Short Press", e.latlng);
      if (longpress) {
        map.setView(e.latlng);
      }
    });

    return map;
  }

  addBaseLayer(map, baseConfig, type) {

    const config = this.getBaseMapConfig(baseConfig, type);
    L.tileLayer(config.url, { attribution: config.attribution}).addTo(map);
  }

  addEmotionsLayer(map, emojiConfig) {

    FirebaseService.instance().getEmotions((emotions) => {
      if (this.emotionsLayer) {
        this.emotionsLayer.removeFrom(map);
      }
      this.emotionsLayer = L.geoJSON(emotions, {pointToLayer: (feature, latlng) => this.pointToLayer(feature, latlng, emojiConfig)}).addTo(map);
    })
  }

  pointToLayer(feature, latlng, emojiConfig) {
    const icon = L.icon({
      iconUrl: emojiConfig[feature.properties.emoji].url,
      iconSize:     [28, 28],
      iconAnchor:   [14, 14],
      popupAnchor:  [24, 0] // point from which the popup should open relative to the iconAnchor
    });

    return L.marker(latlng, {icon: icon});
  }

  addUserPosition(map) {

    LocationService.instance().startMonitoring((position) => {
      this.position = position;
      if (this.userPositionLayer) {
        this.userPositionLayer.removeFrom(map);
      }
      this.userPositionLayer = L.circleMarker([position.coords.latitude, position.coords.longitude], {
        color: 'crimson',
        fillColor: 'crimson',
        fillOpacity: 0.5,
        radius: 12
      }).addTo(map);
    });

  }

  centerClicked(){
    console.log('e clicked', this.position);
    var latlng = [this.position.coords.latitude, this.position.coords.longitude]
    this.map.flyTo(latlng);
  }

}

customElements.define("map-component", MapComponent);