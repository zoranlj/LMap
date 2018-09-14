import { Component, Prop, Element, Watch, Event, EventEmitter } from '@stencil/core';
import { Map, TileLayer, Marker, Icon } from 'leaflet';
import L from 'leaflet';

@Component({
  tag: 'l-map',
  styleUrls: [
    'l-map.css',
    '../../../node_modules/leaflet/dist/leaflet.css'
  ],
  shadow: true
})

export class LMap {
  @Element() LMapHTMLElement: HTMLElement;
  @Prop() iconUrl: string;
  @Prop() tileLayer: string;
  @Prop() locations: string;
  @Watch('locations')
  handleLocationsChanged(locations: string) {
    this.addMarkers(JSON.parse(locations));
  }
  @Event() message: EventEmitter;


  LMap: Map;

  render() {
    return (
      <div id="l-map"></div>
    );
  }

  componentDidLoad() {
    const LMapElement: HTMLElement = this.LMapHTMLElement.shadowRoot.querySelector('#l-map');
    this.LMap = L.map(LMapElement, {minZoom: 2, maxZoom: 6}).setView([20, -10], 3);
    const tileLayer: TileLayer = L.tileLayer(this.tileLayer);
    tileLayer.addTo(this.LMap);
  }

  addMarkers(locations) {
    const modusLogo: Icon = L.icon({
      iconUrl: this.iconUrl,
      iconSize: [30, 30]
    });
    let marker: Marker;
    locations.map(latLng => {
      marker = L.marker(latLng, { icon: modusLogo });
      marker.addTo(this.LMap);
    });
    this.message.emit('addMarkersFinished');
  }

}
